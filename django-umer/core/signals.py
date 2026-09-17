"""This signal.py runs when user updated the model"""
import json
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.forms.models import model_to_dict
from asgiref.sync import async_to_sync

from channels.layers import get_channel_layer

import pyotp

from core import models

def generate_key():
    """ User otp key generator """
    key = pyotp.random_base32()
    if is_unique(key):
        return key
    generate_key()

def is_unique(key):
    """ checking that the key is unique or not"""
    from .models import CustomUser  # Deferred import
    try:
        CustomUser.objects.get(key=key)
    except CustomUser.DoesNotExist:
        return True
    return False

@receiver(pre_save, sender='core.CustomUser')  # Deferred sender specification
def create_key(sender, instance, **kwargs):
    """ creating the key"""
    _ = sender
    _ = kwargs
    print("instance")
    if not instance.key:
        instance.key = generate_key()


@receiver(post_save, sender='core.Post')
def handle_post_save(sender, instance, created, **kwargs):
    """if post has been added, it will run send_post_notification function to notify the user"""
    if created:
        try:
            channel_layer = get_channel_layer()
            data =  "New post has been added. Title: " + instance.Post_Textfield
            notification = models.Notification(notification=data)
            notification.save()
            async_to_sync(channel_layer.group_send)(
                "all_users_group",
                {
                    "type": "send_post_notification",
                    "value": data
                }
            )
        except Exception as e:
            print(e)
    else:
        pass


@receiver(post_save, sender='core.Comment')
def handle_comment_save(sender, instance, created, **kwargs):
    """if post has been added, it will run send_post_notification function to notify the user"""
    print("comment added signals", created)
    channel_room = 0   # Send notification to the user who owns the post
    if created:
        try:
            channel_layer = get_channel_layer()
            data = model_to_dict(instance)
            if data['parent_comment'] == None:
                data['message'] = "User Commented on your post : " + instance.Post.Post_Textfield
                data['reply'] = False
                channel_room = instance.Post.user_id.id

            else:
                data['message'] = "User replyed on your comment : " + instance.parent_comment.Text,
                data['user_id'] = instance.parent_comment.user_id.pk
                data['reply'] = True
                channel_room = instance.parent_comment.user_id.pk

            async_to_sync(channel_layer.group_send)(
                "test_consumer_group_" + str(channel_room),
                {
                    "type": "send_comment_notification",
                    "value": json.dumps(data)
                }
            )
        except Exception as e:
            print(e)
    else:
        pass

@receiver(post_save, sender='core.Like')
def handle_like_save(sender, instance, created, **kwargs):
    """if post has been added, it will run send_post_notification function to notify the user"""
    print("Like added signals", created)
    if created:
        try:
            channel_layer = get_channel_layer()
            data = model_to_dict(instance)
            # {'id': 719, 'user_id': 1, 'comment_id': None, 'Post_id': 18}
            print(data)
            data['message'] = "User like the post: " + instance.Post_id.Post_Textfield

            async_to_sync(channel_layer.group_send)(
                "test_consumer_group_" + str(instance.Post_id.user_id.id),
                {
                    "type": "send_like_notification",
                    "value": json.dumps(data)
                }
            )
        except Exception as e:
            print(e)
    else:
        pass


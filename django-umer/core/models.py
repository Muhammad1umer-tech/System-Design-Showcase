"""
it has all the model that has been used in this project, till now.
"""
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import (BaseUserManager)

import pyotp

class TimestampedModel(models.Model):
    """
    phonenumber verification helper and parent calss. implemented
    this using medium articles
    """
    # A timestamp representing when this object was created.
    created_at = models.DateTimeField(auto_now_add=True)
    # A timestamp reprensenting when this object was last updated.
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        """
        Meta class of TimestampedModel
        """
        abstract = True
        ordering = ['-created_at', '-updated_at']
class CustomUserManager(BaseUserManager):
    """
    custom user helper class, its object is being used in custom class.
    """
    def create_user(self, email, password=None, **extra_fields):
        """
        Simple user creation function
        """
        if not email:
            raise ValueError("Please provide Email")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, password=None, **extra_fields):
        """
        is user is admin, then bellow arrtibutes will be marked true
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    """
    Custom user, implemented this using medium article.(bookmarked)
    """
    email = models.EmailField(unique=True)
    is_creator = models.BooleanField(default=False)
    is_editor = models.BooleanField(default=False)
    is_Premium_user = models.BooleanField(default=False)
    stripe_checkout_id = models.TextField(max_length=200, blank=True, null=True)
    key = models.CharField(max_length=100, default='', blank=True)
    is_verified_email = models.BooleanField(default=False)
    is_social_login = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()
    def __str__(self):
        return str(self.email)

    def authenticate(self, otp):
        """ This method authenticates the given otp"""
        provided_otp = 0
        try:
            provided_otp = int(otp)
        except ValueError:
            return False
        #Here we are using Time Based OTP. The interval is 60 seconds.
        #otp must be provided within this interval or it's invalid
        t = pyotp.TOTP(self.key, interval=300)
        return t.verify(provided_otp)
class Category(models.Model):
    """
    I created this model to store the category (related to post)
    """
    class Meta:
        """
        Meta class
        """
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
    Category_name = models.CharField(max_length=20, unique=True, blank=False)
    def __str__(self):
        return str(self.Category_name)

class Tag(models.Model):
    """
    I created this model to store the tags (related to post)
    """
    tag_name = models.CharField(max_length=50)
    def __str__(self):
        return str(self.tag_name)
class PhoneNumber(TimestampedModel):
    """
    I created this model to store the numbers and is it verified or not
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    number = models.CharField(max_length=17, blank=True)
    verified = models.BooleanField(default=False)

    # def __str__(self):
    #     return str(self.user.email)
class Post(models.Model):
    """
    I created this model to store the post.
    (post can be created only from admin panel and django admin panel)
    """
    Post_Textfield = models.TextField(max_length=500)
    content = models.TextField(max_length=5000, default='')
    image_Field = models.ImageField(upload_to='posts')
    Category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="Posts")
    tags = models.ManyToManyField(Tag)
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    views = models.IntegerField(default=0)
    Featured = models.BooleanField(default=False)
    Top = models.BooleanField(default=False)
    like = models.IntegerField(default=0)
    Comment = models.IntegerField(default=0)
    isPremium = models.BooleanField(default=False)
    scheduling_date_time = models.DateTimeField(default=timezone.now)
    # @property
    # def get_likes_and_comments(self):
    #     print(len(self.Likes.all()))
    #     print(len(self.Comments.all()))

    def __str__(self):
        return str(self.Post_Textfield)
class Comment(models.Model):
    """
    I created this model to store the comment that every
    user do on comment and post. (3-levels only)
    """
    Text = models.TextField(max_length=500)
    Post = models.ForeignKey(Post,
    on_delete=models.CASCADE,
    null=True, blank=True,
    related_name='Comments')
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='Comments')
    parent_comment = models.ForeignKey('self',
    on_delete=models.CASCADE,
    null=True,
    blank=True)
    like = models.IntegerField(default=0)
    def clean(self):
        if not self.Post and not self.parent_comment:
            raise ValidationError("Either comment or reply is required.")
    def __str__(self):
        return str(self.Text)
class Like(models.Model):
    """
    I created this model to store the like that every user do on comment and post.
    """
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='Likes')
    comment_id = models.ForeignKey(Comment,
    on_delete=models.CASCADE,
    null=True,
    blank=True,
    related_name='Likes')
    Post_id = models.ForeignKey(Post,
    on_delete=models.CASCADE,
    null=True,
    blank=True,
    related_name='Likes')
    def clean(self):
        if not self.comment_id and not self.Post_id:
            raise ValidationError("Either comment or post is required.")
    def __str__(self):
        return str(self.id)

class Subscription(models.Model):
    """
    I created this model to store the subscription(Premium users).
    poduct_id is taken from the stripe
    """
    name = models.CharField(max_length=100)
    product_id = models.CharField(max_length=100)
    price = models.FloatField()
    def __str__(self):
        return str(self.name)

class Notification(models.Model):
    """
    I created this model to store the notification
    """
    notification = models.CharField(max_length=100)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE, null=True)
    to_user = models.ForeignKey(CustomUser,
    on_delete=models.CASCADE,
    null=True,
    blank=True)
    is_post_notification = models.BooleanField(default=True)
class Items(models.Model):
    """
    I created this model to implement e commerce add to cart system
    """
    Category =  models.ManyToManyField(Category)
    discount = models.FloatField()
    fullDescription = models.TextField(max_length=500)
    image = models.ImageField(upload_to='posts')
    name = models.CharField(max_length=100)
    offerEnd = models.DateTimeField(default=timezone.now)
    price = models.FloatField()
    rating = models.IntegerField()
    salesCount = models.IntegerField()
    shortDescription = models.TextField(max_length=500)
    sku = models.CharField(max_length=10)
    tag = models.ManyToManyField(Tag)
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    stock = models.IntegerField(default=1)
    subscription_id = models.CharField(max_length=100, default='')
    subscription_id_eur = models.CharField(max_length=100, default='')
    subscription_id_de = models.CharField(max_length=100, default='')

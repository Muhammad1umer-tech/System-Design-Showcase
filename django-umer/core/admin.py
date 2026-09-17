"""
admin panel working
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm
from django.db import models as model_db

from ckeditor.widgets import CKEditorWidget

from .models import CustomUser
from . import models

class CategoryAdmin(admin.ModelAdmin):
    """
    Category admin class
    """
    list_display = ['id', 'Category_name']
    ordering = ['id']

class ItemsAdmin(admin.ModelAdmin):
    """
    Category admin class
    """
    list_display = ['id', 'name']
class LikeAdmin(admin.ModelAdmin):
    """
    like admin class
    """
    list_display = ['id', 'comment_id', 'Post_id', 'user_id']
class CommentAdmin(admin.ModelAdmin):
    """
    CommentAdmin admin class, admin cannot modify like
    """
    list_display = ['id', 'Text', 'Post', 'parent_comment', 'user_id', 'like']
    readonly_fields = ['like']
class PostAdmin(admin.ModelAdmin):
    """
    CommentAdmin admin class, task was given and use CKEditorWidget to complete the task.
    """
    list_display = ['Featured','Top', 'id', 'Post_Textfield',
    'Category', 'user_id', 'views', 'like',
    'Comment', 'scheduling_date_time', 'isPremium']
    formfield_overrides = {
        model_db.TextField: {'widget': CKEditorWidget},
    }

class TagAdmin(admin.ModelAdmin):
    """
    tag class
    """
    list_display = ['id', 'tag_name']
class CustomUserChangeForm(UserChangeForm):
    """
    Form for custom user changes.
    This class intentionally has no additional methods beyond those inherited from UserChangeForm.
    """
    class Meta(UserChangeForm.Meta):
        """
        Meta class for custom user form.

        This class has no additional methods beyond those inherited from UserChangeForm.
        """
        model = CustomUser
class CustomUserAdmin(UserAdmin):
    """
    Custom User
    """
    form = CustomUserChangeForm
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Permissions', {'fields':
        ('is_creator', 'is_editor',
        'is_Premium_user', 'is_social_login')}),
    )
    list_display = ["is_social_login", "username", "key", "stripe_checkout_id",
    "id", "email", "is_staff", "is_superuser",
    "is_creator", "is_editor", "is_Premium_user"]
class SubscriptionAdmin(admin.ModelAdmin):
    """
    for Subscription (Stripe)
    """
    list_display = ['id', 'name', 'product_id', 'price']
class PhoneNumbeerAdmin(admin.ModelAdmin):
    """
    for PhoneNumber class(Twilio)
    """
class NotificationAdmin(admin.ModelAdmin):
    """
    for Notification
    """
    list_display = ['id', 'post_id', 'to_user', 'notification', 'is_post_notification']

admin.site.register(models.Notification, NotificationAdmin)
admin.site.register(models.PhoneNumber, PhoneNumbeerAdmin)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(models.Category, CategoryAdmin)
admin.site.register(models.Like, LikeAdmin)
admin.site.register(models.Comment, CommentAdmin)
admin.site.register(models.Post, PostAdmin)
admin.site.register(models.Tag, TagAdmin)
admin.site.register(models.Subscription, SubscriptionAdmin)
admin.site.register(models.Items, ItemsAdmin)

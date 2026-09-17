"""
Basically, this serilizers is used to convert query set into json and vice versa
"""
from rest_framework import serializers

from . import models
class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for Category model.
    """
    class Meta:
        """
        giving meta data (model and all the attributes from the model)
        """
        model = models.Category
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    """
    Serializer for Tag model.
    """
    class Meta:
        """
        giving meta data (model and all the attributes from the model)
        """
        model = models.Tag
        fields = '__all__'

class ItemsSerializer(serializers.ModelSerializer):
    """
    Serializer for Items model.
    """
    tag = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()

    def get_tag(self, obj):
        """
        Retrieve the tags associated with the item.
        """
        return [tag.tag_name for tag in obj.tag.all()]

    def get_category(self, obj):
        """
        Retrieve the category of the item.
        """
        return [cat.Category_name for cat in obj.Category.all()]

    def get_username(self, obj):
        """
        Retrieve the username of the item's owner.
        """
        return obj.user_id.username
    class Meta:
        """
        giving meta data (model and all the attributes from the model)
        """
        model = models.Items
        fields = '__all__'

class PostSerializerCreate(serializers.ModelSerializer):
    """
    Serializer for creating a new Post.
    """
    class Meta:
        """
        giving meta data (model and all the attributes from the model)
        """
        model = models.Post
        fields = '__all__'
        read_only_fields = ['isPremium', 'Top', 'Featured', 'views', 'like', 'Comment']

    def create(self, validated_data):
        """
        Create a new Post.
        """
        print("validated_data", validated_data)
        return super().create(validated_data)

class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for Post model.
    """
    tags = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()

    def get_tags(self, obj):
        """
        Retrieve the tags associated with the post.
        """
        return [tag.tag_name for tag in obj.tags.all()]

    def get_category(self, obj):
        """
        Retrieve the category of the post.
        """
        return obj.Category.Category_name

    def get_username(self, obj):
        """
        Retrieve the username of the post's owner.
        """
        return obj.user_id.username
    class Meta:
        """
        giving meta data (model and all the attributes from the model)
        """
        model = models.Post
        fields = '__all__'
        read_only_fields = ['isPremium', 'Top', 'Featured', 'views', 'like', 'Comment']

class PhoneNumberSerializer(serializers.ModelSerializer):
    """
    Serializer for PhoneNumber model.
    """
    class Meta:
        """
        giving meta data (model and all the attributes from the model)
        """
        model = models.PhoneNumber
        fields = '__all__'
class LikeSerializer(serializers.ModelSerializer):
    """
    Serializer for Like model.
    """
    class Meta:
        """
        giving meta data (model and all the attributes from the model)
        """
        model = models.Like
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer for Comment model.
    """
    class Meta:
        """
        giving meta data (model and all the attributes from the model)
        """
        model = models.Comment
        fields = '__all__'

class SubscriptionSerializers(serializers.ModelSerializer):
    """
    Serializer for Subscription model.
    """
    class Meta:
        """
        giving meta data (model and all the attributes from the model)
        """
        model = models.Subscription
        fields = '__all__'

class NotificationSerializers(serializers.ModelSerializer):
    """
    Serializer for Notification model.
    """
    class Meta:
        """
        giving meta data (model and all the attributes from the model)
        """
        model = models.Notification
        fields = '__all__'

class UserSerializers(serializers.ModelSerializer):
    """
    Serializer for CustomUser model.
    """
    class Meta:
        """
        giving meta data (model and all the attributes from the model)
        also adding the read only fieds, and unable to view the password
        """
        model = models.CustomUser
        fields = ['id', 'username', 'email', 'password']
        read_only_fields = ['is_Premium_user']
        extra_kwargs = {
            "password": {"write_only" : True }
        }

    def create(self, validated_data):
        """
        Create a new CustomUser instance.
        """
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

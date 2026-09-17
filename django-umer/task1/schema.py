import graphene
from graphene_django import DjangoObjectType
from core import models

# Define DjangoObjectType for each model
class PhoneNumberType(DjangoObjectType):
    class Meta:
        model = models.PhoneNumber

class CustomUserType(DjangoObjectType):
    class Meta:
        model = models.CustomUser

class CategoryType(DjangoObjectType):
    class Meta:
        model = models.Category

class TagType(DjangoObjectType):
    class Meta:
        model = models.Tag

class PostType(DjangoObjectType):
    image_Field_url = graphene.String()
    class Meta:
        model = models.Post
        fields = (
            "id",
            "Post_Textfield",
            "content",
            "image_Field",
            "Category",
            "user_id",
            "tags",
            "views",
            "Featured",
            "Top",
            "like",
            "Comment",
            "isPremium",
            "scheduling_date_time",
        )

    def resolve_image_Field_url(self, info):
        self.image_Field = info.context.build_absolute_uri(self.image_Field.url)
        return self.image_Field

class CommentType(DjangoObjectType):
    class Meta:
        model = models.Comment

class LikeType(DjangoObjectType):
    class Meta:
        model = models.Like

class SubscriptionType(DjangoObjectType):
    class Meta:
        model = models.Subscription

class NotificationType(DjangoObjectType):
    class Meta:
        model = models.Notification


class Query(graphene.ObjectType):
    all_phone_numbers = graphene.List(PhoneNumberType)
    all_custom_users = graphene.List(CustomUserType)
    all_categories = graphene.List(CategoryType)
    all_tags = graphene.List(TagType)
    all_posts = graphene.List(PostType)
    all_comments = graphene.List(CommentType)
    all_likes = graphene.List(LikeType)
    all_subscriptions = graphene.List(SubscriptionType)
    all_notifications = graphene.List(NotificationType)

    custom_users_by_id = graphene.Field(CustomUserType, pk=graphene.Int())
    specific_posts = graphene.Field(PostType, id=graphene.Int())

    def resolve_all_phone_numbers(self, info):
        return models.PhoneNumber.objects.all()

    def resolve_custom_users_by_id(root, info, pk):
        return models.CustomUser.objects.filter(pk=pk).first()

    def resolve_all_custom_users(self, info):
        return models.CustomUser.objects.all()

    def resolve_all_categories(self, info):
        return models.Category.objects.all()

    def resolve_all_tags(self, info):
        return models.Tag.objects.all()

    def resolve_specific_posts(self, info, id):
        return models.Post.objects.filter(pk=id).first()

    def resolve_all_posts(self, info):
        return models.Post.objects.all()

    def resolve_all_comments(self, info):
        return models.Comment.objects.all()

    def resolve_all_likes(self, info):
        return models.Like.objects.all()

    def resolve_all_subscriptions(self, info):
        return models.Subscription.objects.all()

    def resolve_all_notifications(self, info):
        return models.Notification.objects.all()

schema = graphene.Schema(query=Query)

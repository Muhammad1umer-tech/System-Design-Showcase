"""approx, all the backend lies in this views"""
import stripe
import jwt
import pyotp
import json
import requests
from decouple import config

from rest_framework import generics
from rest_framework.permissions import IsAdminUser,IsAuthenticated,BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from rest_framework import status, viewsets, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.pagination import PageNumberPagination
from rest_framework import status

from io import StringIO
from django.utils import timezone
from django.shortcuts import get_object_or_404, render
from django.views.generic import TemplateView
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse

from twilio.rest import Client as TwilioClient
from twilio.base.exceptions import TwilioException

import pandas as pd # type: ignore
from fpdf import FPDF # type: ignore
from PIL import Image
import textwrap

# from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
# from django_elasticsearch_dsl_drf.filter_backends import (
#     FilteringFilterBackend,
#     CompoundSearchFilterBackend,
# )

from .models import PhoneNumber
from . import models
from . import serializers
# from .documents import PostDocument
from .serializers import PhoneNumberSerializer
from . import signals

stripe.api_key = settings.STRIPE_SECRET_KEY

def decode_access_token(headers):
    """It basically helps me to decode every access
    token and give me user instance"""
    access_token_encode = headers['Authorization']
    access_token = jwt.decode(
    access_token_encode.split(' ')[1],
    verify=False,
    options={'verify_signature': False})
    user_id = access_token['user_id']
    user_instance = models.CustomUser.objects.get(pk=user_id)
    return user_instance
def decode_access_token_arg(access_token_encode):
    """It basically helps me to decode every access
    token and give me user instance"""
    access_token = jwt.decode(
    access_token_encode,
    verify=False,
    options={'verify_signature': False})
    user_id = access_token['user_id']
    user_instance = models.CustomUser.objects.get(pk=user_id)
    return user_instance
class CreateCategory(generics.CreateAPIView):
    """it creates the category"""
    # permission_classes = [IsAdminUser]
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
    def post(self, request):
        """post function"""
        ##print(request.data["Category_name"])
        category = models.Category.objects.create(
        Category_name=request.data["Category_name"])
        category.save()
        return Response("Category Entered Successfully")
class SeeCategory(APIView):
    """it help me to retrive all categories"""
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.CategorySerializer
    def get(self, request):
        """get function"""
        _ = request
        categories = models.Category.objects.all()
        category = serializers.CategorySerializer(categories, many=True)
        return Response(category.data)
class UpdateCategory(generics.UpdateAPIView):
    """it help me to update the categories"""
    permission_classes = [IsAdminUser]
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
class DeleteCategory(generics.DestroyAPIView):
    """it help me to delete the categories"""
    permission_classes = [IsAdminUser]
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
class SeeTags(APIView):
    """it help me to see all tags"""
    # permission_classes = [IsAuthenticated]
    serializer_class = serializers.TagSerializer
    def get(self, request):
        """get function"""
        _ = request
        tags = models.Tag.objects.all()
        tag = serializers.TagSerializer(tags, many=True)
        return Response(tag.data)

# class create_post(generics.ListCreateAPIView):
    # permission_classes = [IsAuthenticated]
    # queryset = models.Post.objects.all()
    # serializer_class = serializers.PostSerializer
    # def create(self, request, *args, **kwargs):
    #     Post_Textfield = request.data['Post_Textfield']
    #     Category = models.Category.objects.get(Category_name=request.data['Category'])
    #     user_id = request.data['user_id']
    #     tags_from_req = request.data['tags']
    #     new_post = {
    #         "Post_Textfield": Post_Textfield,
    #         "Category": Category.pk,
    #         "user_id": user_id,
    #         "tags": []
    #     }
    #     for tag in tags_from_req:
    #         tag_instance_from_model = models.Tag.objects.get(tag_name=tag)
    #         new_post['tags'].append(tag_instance_from_model.pk)
    #     # ##print("haaaaaaaaaaaaaaa", Post_Textfield, Category, user_id, tags_from_req)
    #     serializer = self.get_serializer(data=new_post)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     headers = self.get_success_headers(serializer.data)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
# custom permission
class CustomerPermissionCreate(BasePermission):
    """only creator has permission"""
    Message = "Only creator are allowed to create the post"
    def has_permission(self, request, view):
        """has_permission function (custom permission)"""
        _ = view
        try:
            if not request.user.is_creator  :
                raise PermissionDenied(self.Message)
            return True
        except AttributeError:
            return False
class CustomerPermissionEit(BasePermission):
    """only editor has permission"""
    Message = "Only editor are allowed to editor the post"
    def has_permission(self, request, view):
        """has_permission function (custom permission) for editor"""
        _ = view
        if not request.user.is_editor:
            raise PermissionDenied(self.Message)
        return True

def newsletter(user_id):
    """Its send mail to all user whenever admin created the post"""
    users = models.CustomUser.objects.all()
    for user in users:
        try:
            send_mail(
                "New Post added",
                "{user_id} has uploaded the new Post, Do check it out",
                "mumertrade8@gmail.com",
                [user.email],
                fail_silently=False,
            )
            #print("mail sent to {user.email}")
        except Exception as e:
            print(str(e))
# post   APIVIEW->POST, GET
class CreatePost(APIView):
    """create post function and implemented thumbnail/high resolution as well"""
    # permission_classes = [CustomerPermissionCreate]
    serializer_class = serializers.PostSerializerCreate
    def post(self, request):
        """post function"""
        try:
            Category = models.Category.objects.get(
            Category_name=request.data['category'])
            tags_from_req = [request.data['tags']]
            data = {
                "Post_Textfield": request.data['Post_Textfield'],
                "content": request.data['content'],
                "Category": Category.pk,
                "image_Field": request.data['image_Field'],
                "user_id": 1,
                "tags": [],
                "scheduling_date_time": request.data['scheduling_date_time']
            }
            for tag in tags_from_req:
                tag_instance_from_model = models.Tag.objects.get(tag_name=tag)
                data['tags'].append(tag_instance_from_model.pk)
            serializer = self.serializer_class(data=data)
            if serializer.is_valid():
                serializer.save()
                # newsletter(user_id)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

# class create_post(APIView):
    # permission_classes = [CustomerPermissionCreate]
    # serializer_class = serializers.PostSerializer
    # def post(self, request, *args, **kwargs):
    #     Post_Textfield = request.data['Post_Textfield']
    #     content = request.data['content']
    #     Category = models.Category.objects.get(pk=request.data['Category'])
    #     image_field = request.FILES['image_Field']
    #     user_id = request.data['user_id']
    #     tags_from_req = request.data['tags']
    #     scheduling_date_time = request.data['scheduling_date_time']
    #     ##print(image_field)
    #     data = {
    #         "Post_Textfield": Post_Textfield,
    #         "content": content,
    #         "Category": Category.pk,
    #         "image_field": image_field,
    #         "user_id": user_id,
    #         "tags": [],
    #         "scheduling_date_time": scheduling_date_time
    #     }
    #     for tag in tags_from_req:
    #         tag_instance_from_model = models.Tag.objects.get(pk=tag)
    #         data['tags'].append(tag_instance_from_model.pk)
    #     serializer = self.serializer_class(data=data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class ShowAllPostScheduleTask(APIView):
    """implemented scheduling task, post that is schedule for later will
    not be shown"""
    def get(self, request):
        """get function"""
        _ = request
        all_posts = models.Post.objects.filter(
        scheduling_date_time__lte=timezone.now())
        ##print(timezone.now())
        serializer = serializers.PostSerializer(all_posts, many=True)
        return Response(serializer.data)
class CommentOnPostOrComment(APIView):
    """ function that helps me to comment
    1- it check is data coming the frontend has
    parent_comment then will be stored as a reply
    2-if it has post. then it will be stored as first comment
    """
    serializer_class = serializers.CommentSerializer
    def post(self, request):
        """post function"""
        temp = {}
        access_token_encode = request.headers['Authorization']
        access_token = jwt.decode(
        access_token_encode.split(' ')[1],
        verify=False,
        options={'verify_signature': False})
        user_id = access_token['user_id']
        user_id = models.CustomUser.objects.get(pk=user_id)
        if request.data['parent_comment']:
            parent_comment_instance = models.Comment.objects.get(
            pk=request.data['parent_comment'])
            post_instance = models.Post.objects.get(pk=request.data['Post'])
            child_comment_instance = models.Comment(
            Text=request.data['Text'],
            Post=post_instance,
            user_id=user_id,
            parent_comment=parent_comment_instance)
            child_comment_instance.save()
            ##print("gaaaaa")
            instance = models.Comment.objects.filter(
            pk=child_comment_instance.id).select_related('user_id')
            temp = {
                'id': instance[0].id,
                'Post': instance[0].Post.id,
                'Text':request.data['Text'],
                'username': instance[0].user_id.username,
                'parent_comment': request.data['parent_comment']
                # "comment_no": post_instance.Comment,
                # "like": post_instance.like,
            }
        elif request.data['Post']:
            post_instance = models.Post.objects.get(pk=request.data['Post'])
            comment_instance = models.Comment(
            Text=request.data['Text'],
            Post=post_instance,
            user_id=user_id,
            parent_comment=request.data['parent_comment'])
            comment_instance.save()
            post_instance.Comment = post_instance.Comment + 1
            post_instance.save()
            instance = models.Comment.objects.filter(
            pk=comment_instance.id).select_related('user_id')
            temp = {
                'id': instance[0].id,
                'Text':instance[0].Text,
                'username': instance[0].user_id.username,
                "comment_no": post_instance.Comment,
                "like": post_instance.like,
            }
        return Response(temp)
class GetReplyComment(APIView):
    """retrive all the reply of the post"""
    # name, date, title
    def get(self, request, pk):
        """get function"""
        _ = request
        comments = models.Comment.objects.filter(
        Post=pk).exclude(
        parent_comment=None).select_related('user_id')
        comments_json = []
        for comment in comments:
            temp = {
                'id': comment.pk,
                'Text':comment.Text,
                'username': comment.user_id.username,
                'parent_comment': comment.parent_comment.pk,
                'like': comment.like
            }
            comments_json.append(temp)
        return Response(comments_json)
class GetComment(APIView):
    """retrive specific comment"""
    # name, date, title
    def get(self, request, pk):
        """get function"""
        _ = request
        comments = models.Comment.objects.filter(
        Post=pk,
        parent_comment=None).select_related('user_id')
        comments_json = []
        for comment in comments:
            temp = {
                'id': comment.pk,
                'Text':comment.Text,
                'username': comment.user_id.username,
                'like': comment.like
            }
            comments_json.append(temp)
        return Response(comments_json)
class GetAllLevelComment(APIView):
    """retrive comment and replies on the basis of level(Trello task)"""
    # name, date, title
    def get(self, request, pk):
        """get function"""
        _ = request
        comments = models.Comment.objects.filter(
        Post=pk,
        parent_comment=None).select_related('user_id')
        if len(comments) == 0:
            return Response([])
        arr = []
        for comment in comments:
            comment_json = serializers.CommentSerializer(comment).data
            comment_json['username'] = comment.user_id.username
            replies_1 = models.Comment.objects.filter(
            parent_comment=comment_json['id']).select_related('user_id')
            arr1 = []
            for reply_1 in replies_1:
                reply_1_json = serializers.CommentSerializer(reply_1).data
                reply_1_json['username'] = reply_1.user_id.username
                replies_2 = models.Comment.objects.filter(
                parent_comment=reply_1.id).select_related('user_id')
                arr2 = []
                for reply_2 in replies_2:
                    reply_2_json = serializers.CommentSerializer(reply_2).data
                    reply_2_json['username'] = reply_2.user_id.username
                    replies_3 = models.Comment.objects.filter(
                    parent_comment=reply_2.id).select_related('user_id')
                    arr3 = []
                    for reply_3 in replies_3:
                        reply_3_json = serializers.CommentSerializer(reply_3).data
                        reply_3_json['username'] = reply_3.user_id.username
                        arr3.append(reply_3_json)
                    reply_2_json['reply_3'] = arr3
                    arr2.append(reply_2_json)
                reply_1_json['reply_2'] = arr2
                arr1.append(reply_1_json)
            comment_json['reply_1'] = arr1
            arr.append(comment_json)
        return Response(arr)
        #
        #     for reply_2 in replies_level_2:
        #         replies_level_3=models.Comment.objects.filter(
        #         parent_comment=reply_2.id).select_related('user_id')
        #     temp = {
        #         'comment': serializers.CommentSerializer(comment),
        #         'reply_1':
        #     }
# class get_all_post(APIView):
#     serializer_class = serializers.PostSerializer
#     # permission_classes = [IsAuthenticated]
#     def get(self, request):
#         user_id = models.CustomUser.objects.get(pk=request.user.id)
#         if user_id.is_Premium_user == True:
#             posts = models.Post.objects.all()
#         else:
#             posts = models.Post.objects.filter(isPremium=False)
#         serializer = self.serializer_class(posts, many=True)
#         return Response(serializer.data)
from rest_framework import filters
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend # type: ignore
class PostViewSet(viewsets.ModelViewSet):
    queryset = models.Post.objects.all()
    serializer_class = serializers.PostSerializer
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['Post_Textfield']

class GetAllPost(APIView):
    """retrive all the post"""
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    pagination_class = PageNumberPagination
    def get(self, request):
        """get function"""
        try:
            user_instance = decode_access_token(request.headers)
            if user_instance.is_Premium_user:
                posts = models.Post.objects.all()
            else:
                posts = models.Post.objects.filter(isPremium=False)
            paginator = self.pagination_class()
            paginated_queryset = paginator.paginate_queryset(posts, request)
            serializer = serializers.PostSerializer(paginated_queryset, many=True)
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            return Response("An Error Occured {e}", status.HTTP_400_BAD_REQUEST)
class GetAllPostAdmin(APIView):
    """retrive all the post (for admin) Testing function"""
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        """get function"""
        _ = request
        post = models.Post.objects.all()
        ser = serializers.PostSerializer(post, many=True)
        return Response(ser.data)
# class get_all_post(APIView):
#     serializer_class = serializers.PostSerializer
#     def get(self, request):
#         access_token_encode = request.headers.get('Authorization')
#         if access_token_encode == None:
#             posts = models.Post.objects.filter(scheduling_date_time__lte=timezone.now())
#         else:
#             access_token = jwt.decode(access_token_encode, None, None)
#             user_id = access_token['user_id']
#             user = models.CustomUser.objects.get(pk=user_id)
#             if user.is_Premium_user == True:
#                 posts = models.Post.objects.filter(scheduling_date_time__lte=timezone.now())
#             else:
#                 posts = models.Post.objects.filter(isPremium=False,
#                 scheduling_date_time__lte=timezone.now())
#         serializer = self.serializer_class(posts, many=True)
#         return Response(serializer.data)
class GetSpecificPost(APIView):
    """retrive post on the basis of id"""
    def get(self, request, pk):
        """get function"""
        _ = request
        post = models.Post.objects.get(pk=pk)
        ser = serializers.PostSerializer(post)
        return Response(ser.data)

def UpdateViewCount(self, post_id):
    """Trello task (if user stays at the post for more than 10seconds then
    increase its count"""
    # Check if 10 seconds have passed since the user viewed the post
    start_time = self.request.session.get('start_time')
    del self.request.session['start_time']
    if start_time is not None:
        current_time = timezone.now().timestamp()
        if current_time - start_time >= 10:
            # Update view count for the post
            post = models.Post.objects.get(pk=post_id)
            post.views += 1
            post.save()
            ##print("view updated")
            return JsonResponse({'message': 'View count updated'})
    ##print("None")
    return JsonResponse({'message': 'Timer not expired yet'})
# retrieve -> get_object
class IsPremiumUser(BasePermission):
    """function than check is user is premium than, show all post to them"""
    Message = "Only Premium are allowed to see premium post"
    def has_permission(self, request, view):
        """has_permission function (custom permission) for premium user"""
        post_id = view.kwargs.get('pk')
        post = models.Post.objects.get(pk=post_id)
        try:
            if not request.user.is_Premium_user  and post.isPremium:
                raise PermissionDenied(self.Message)
            return True
        except AttributeError:
            return True
class AddingViews(APIView):
    """Adding views function (Trello task)"""
    def post(self, request):
        """post function"""
        ##print(request.data)
        post = models.Post.objects.get(pk=request.data['id'])
        post.views+=1
        post.save()
        return Response("View added")
class GetPost(APIView):
    """get the post on the basis of pk"""
    def get(self, request, pk):
        """get function"""
        _ = request
        posts = models.Post.objects.get(pk=pk)
        serializer = serializers.PostSerializer(posts)
        tag_id = models.Tag.objects.get(tag_name=serializer.data['tags'][0])
        response_data = serializer.data
        response_data['tag_id'] = tag_id.pk
        print(response_data)
        return Response(response_data)

class GetPostPremium(generics.RetrieveAPIView):
    """test function to view only premium function only"""
    permission_classes = [IsPremiumUser]
    queryset = models.Post.objects.all()
    serializer_class = serializers.PostSerializer
    lookup_field = 'pk'
    def get_object(self):
        """function"""
        pk = self.kwargs.get('pk')
        obj = get_object_or_404(self.queryset, pk=pk)
        # obj.get_likes_and_comments
        UpdateViewCount(self, pk)
        self.request.session['start_time'] = timezone.now().timestamp()
        return obj
class show_popular_post(APIView):
    """Trello function to retrive only popular function
    Popular function is retrieve on the basis of like"""
    permission_classes = [IsAuthenticated]
    def get(self, request):
        """get function"""
        user_instance = decode_access_token(request.headers)
        if user_instance.isPremiumUser:
            popular_post = models.Post.objects.order_by('-like')
        else:
            popular_post = models.Post.objects.filter(isPremium=False).order_by('-like')
        serializer = serializers.PostSerializer(popular_post, many=True)
        return Response(serializer.data)

class ShowAllCategoryPost(APIView):
    """Retrieve teh post on the basis of category"""
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        """get function"""

        user_instance = decode_access_token(request.headers)
        print(user_instance.is_Premium_user)
        # language = request.headers['Accept-Language']
        if user_instance.is_Premium_user:
            trending_posts = models.Post.objects.order_by('-views')[:2]
            popular_posts = models.Post.objects.order_by('-like')[:2]
            top_posts = models.Post.objects.filter(Top=True)[:2]
            featured_posts = models.Post.objects.filter(Featured=True)[:2]
        else:
            trending_posts = models.Post.objects.filter(
            isPremium=False).order_by('-views')[:2]
            popular_posts = models.Post.objects.filter(
            isPremium=False).order_by('-like')[:2]
            top_posts = models.Post.objects.filter(
            isPremium=False, Top=True)[:2]
            featured_posts = models.Post.objects.filter(
            isPremium=False, Featured=True)[:2]

        temp = {
            'trending_posts': serializers.PostSerializer(
            trending_posts, many=True).data,
            'popular_posts':serializers.PostSerializer(
            popular_posts, many=True).data,
            'top_posts':serializers.PostSerializer(
            top_posts, many=True).data,
            'featured_posts':serializers.PostSerializer(
            featured_posts, many=True).data,
        }
        return Response(temp)
class ShowTrendingPost(APIView):
    """Trello function to retrive only trending function
    Popular function is retrieve on the basis of views"""
    # permission_classes = [IsAuthenticated]
    serializer_class = serializers.PostSerializer
    pagination_class = PageNumberPagination
    def get(self, request):
        """get function"""
        user_instance = decode_access_token(request.headers)
        if user_instance.is_Premium_user:
            queryset = models.Post.objects.filter(views__gt=0).order_by('-views')
        else:
            queryset = models.Post.objects.filter(
            isPremium=False, views__gt=0).order_by('-views')
        paginator = self.pagination_class()
        paginated_queryset = paginator.paginate_queryset(
        queryset, request)
        serializer = self.serializer_class(
        paginated_queryset, many=True)
        return paginator.get_paginated_response(
        serializer.data)
class ShowPopularPosts(APIView):
    """Trello function to retrive only popular function
    Popular function is retrieve on the basis of like"""
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.PostSerializer
    pagination_class = PageNumberPagination
    def get(self, request):
        """get function"""
        queryset = models.Post.objects.order_by('-like')
        paginator = self.pagination_class()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = self.serializer_class(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)
class ShowFeaturedPosts(APIView):
    """Trello function to retrive only features function
    some post are only for premium
    Implementd pagination on it as well"""
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.PostSerializer
    pagination_class = PageNumberPagination
    def get(self, request):
        """get function"""
        user_instance = decode_access_token(request.headers)
        if user_instance.is_Premium_user:
            queryset = models.Post.objects.filter(Featured=True)
        else:
            queryset = models.Post.objects.filter(isPremium=False, Featured=True)
        paginator = self.pagination_class()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = self.serializer_class(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)
class ShowTopPosts(APIView):
    """Trello function to retrive only top function
    top check"""
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.PostSerializer
    pagination_class = PageNumberPagination
    def get(self, request):
        """get function"""
        user_instance = decode_access_token(request.headers)
        if user_instance.is_Premium_user:
            queryset = models.Post.objects.filter(Top=True)
        else:
            queryset = models.Post.objects.filter(isPremium=False, Top=True)
        paginator = self.pagination_class()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = self.serializer_class(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)
class EditPost(generics.UpdateAPIView):
    """Edit post"""
    queryset = models.Post.objects.all()
    serializer_class = serializers.PostSerializer
    def put(self, request, *args, **kwargs):
        try:
            print(request.data, args, kwargs)
            request.data['user_id'] = decode_access_token(request.headers).pk
            return super().put(request, *args, **kwargs)
        except Exception as e:
            # Log the error
            print(f"An error occurred: {e}")
            # Return a meaningful error response
            return Response({"error": "An error occurred while updating the post."},
            status=status.HTTP_400_BAD_REQUEST)

# class ret_upd_del_create_post(generics.RetrieveUpdateDestroyAPIView):
#     """tester function for learning purpose"""
#     permission_classes = [IsAdminUser]
#     queryset = models.Post.objects.all()
#     serializer_class = serializers.PostSerializer
class GetCategoryPosts(APIView):
    """retreive the category on the basis of post"""
    serializer_class = serializers.PostSerializer
    pagination_class = PageNumberPagination
    def get(self, request, category):
        """get function"""
        user_instance = decode_access_token(request.headers)
        cat = models.Category.objects.get(Category_name=category)
        if user_instance.is_Premium_user:
            posts = models.Post.objects.filter(Category=cat)
        else:
            posts = models.Post.objects.filter(isPremium=False, Category=cat)
        # Paginate the queryset
        paginator = self.pagination_class()
        paginated_posts = paginator.paginate_queryset(posts, request)
        ser = serializers.PostSerializer(paginated_posts, many=True)
        print(ser.data)
        return paginator.get_paginated_response(ser.data)
class GetTagPosts(APIView):
    """retreive the tag on the basis of post"""
    serializer_class = serializers.PostSerializer
    pagination_class = PageNumberPagination
    def get(self, request, tag):
        """get function"""
        user_instance = decode_access_token(request.headers)
        tag = models.Tag.objects.get(tag_name=tag)
        if user_instance.is_Premium_user:
            posts = models.Post.objects.filter(tags=tag)
        else:
            posts = models.Post.objects.filter(isPremium=False, tags=tag)
        paginator = self.pagination_class()
        paginated_posts = paginator.paginate_queryset(posts, request)
        ser = serializers.PostSerializer(paginated_posts, many=True)
        return paginator.get_paginated_response(ser.data)
# like
class LikeThePostAndComment(APIView):
    """function the helps me to like the comment and post"""
    serializer_class = serializers.LikeSerializer
    def post(self, request, *args, **kwargs):
        """post function"""
        _ = kwargs
        _ = args
        try:
            access_token_encode = request.headers['Authorization']
            access_token = jwt.decode(
            access_token_encode.split(' ')[1],
            verify=False, options={'verify_signature': False})
            user_id = access_token['user_id']
        except:
            user_id = request.data["user_id"]
        post_id = request.data["Post_id"]
        comment_id = request.data["comment_id"]
        if post_id and comment_id:
            return Response("Please select post or comment")
        try:
            user_instance = models.CustomUser.objects.get(pk=user_id)
        except:
            return Response("Please enter registerd user id")
        if comment_id:
            like_exists_user_comment =  models.Like.objects.filter(
            user_id=user_id,
            comment_id=comment_id)
            comment_instance = models.Comment.objects.get(pk=comment_id)
            if len(like_exists_user_comment) == 0 :
                comment_instance.like+=1
                comment_instance.save()
                user_comment_instance = models.Like(
                user_id=user_instance,
                comment_id=comment_instance)
                user_comment_instance.save()
            else:
                comment_instance.like-=1
                comment_instance.save()
                user_comment_instance = models.Like.objects.get(
                user_id=user_instance,
                comment_id=comment_instance)
                user_comment_instance.delete()
            return Response(comment_instance.like)
        if post_id:
            like_exists_user_post =  models.Like.objects.filter(
            user_id=user_id,
            Post_id=post_id)
            post_instance = models.Post.objects.get(pk=post_id)
            if len(like_exists_user_post) == 0 :
                post_instance.like+=1
                post_instance.save()
                user_post_instance = models.Like(
                user_id=user_instance,
                Post_id=post_instance)
                user_post_instance.save()
            else:
                post_instance.like-=1
                post_instance.save()
                user_post_instance = models.Like.objects.get(
                user_id=user_instance,
                Post_id=post_instance)
                user_post_instance.delete()
            return Response(post_instance.like)
class Paginate(APIView):
    """Pagination (Trello task)"""
    serializer_class = serializers.PostSerializer
    pagination_class = PageNumberPagination
    def get(self, request):
        """get function"""
        queryset = models.Post.objects.all()
        paginator = self.pagination_class()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = self.serializer_class(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)
class SendEmailAPIView(APIView):
    """contact page API (for sending mail)"""
    def post(self, request):
        """post function"""
        subject = request.data['subject']
        message = request.data['message']
        recipient_email = request.data['recipient_email']
        print(request.data, "aa")
        try:
            send_mail(
                subject,
                message,
                'mumertrade8@gmail.com',
                [recipient_email],
                cc = request.data['cc'],
                fail_silently=False,
            )
            return Response({'message': 'Email sent successfully'})
        except Exception as e:
            return Response({'message': f'Error: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class AdminEmailPermission(BasePermission):
    """tester function"""
    message = "Only admin users are allowed to use this API."
    def has_permission(self, request, view):
        """has_permission function (custom permission) is_authenticated or is_superuser"""
        _ = view
        if not request.user.is_authenticated or not request.user.is_superuser:
            raise PermissionDenied(self.message)
        return True
class NotifyEveryoneAboutThePost(APIView):
    """tester function"""
    permission_classes = [AdminEmailPermission]
    def post(self, request):
        """post function"""
        users = models.CustomUser.objects.all()
        subject = request.data['subject']
        message = request.data['message']
        recipient_emails = [user.email for user in users]
        for email in recipient_emails:
            try:
                send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
                )
            except:
                print(email)
        return Response("Email sent")
class PostAlongCommentLike(APIView):
    """retrive the post along with like and comment"""
    def get(self, request, *args, **kwargs):
        """get function"""
        _ = args
        _ = request
        pk = kwargs.get('pk')
        post = models.Post.objects.get(pk=pk)
        comments = models.Comment.objects.filter(Post=pk)
        json_comments = serializers.CommentSerializer(comments, many=True)
        likes = models.Like.objects.filter(Post_id=pk)
        json_like = serializers.LikeSerializer(likes, many=True)
        instance =  {
            "Post_id": pk,
            "Post_Textfield": post.Post_Textfield,
            "Total Like": post.like,
            "Total Comment": post.Comment,
            "Like": json_like.data,
            "Comment": json_comments.data
        }
        return Response(instance)
class SendEmail(APIView):
    """tester function"""
    def post(self, request):
        """post function"""
        try:
            print(request.data)
            # name = request.data['name']
            email = request.data['email']
            subject = request.data['subject']
            message = request.data['message']
            ##print(request.data)
            send_mail(
            subject,
            message,
            email,  # Sender's email address
            ["mumertrade8@gmail.com"],  # Recipient's email address
            )
            return JsonResponse({'message': 'Email sent successfully'})
        except Exception:
            return JsonResponse({'message': 'Email not sent'})
class HomepageView(TemplateView):
    """tester function"""
    template_name = 'index.html'
    def get_context_data(self, **kwargs):
        """tester helper"""
        context = super().get_context_data(**kwargs)
        context['key'] = settings.STRIPE_PUBLIC_KEY
        context['subscriptions'] = models.Subscription.objects.all()
        return context
class PremiumDetails(APIView):
    """Premium member function that give us the subscrption categories"""
    def get(self, request):
        """get function"""
        _ = request
        subscriptions = models.Subscription.objects.all()
        ser = serializers.SubscriptionSerializers(subscriptions, many=True)
        return Response(ser.data)
class CreateCheckoutSession(APIView):
    """function that uses the stripe payment integration
    and make the use premium if he pays"""
    def post(self, request):
        """post function"""
        ##print(request.data)
        price_id = request.data["subscription_id"]
        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price': price_id,
                        'quantity': 1,
                    },
                ],
                mode='subscription',
                success_url=settings.FRONTEND_URL
                +'/success/is_subscription?session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.FRONTEND_URL + '/cancel',
            )
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        return Response(checkout_session.url)

# run when local server is in 4242
# class StripeWebhook(View):
    # def post(self, request, *args, **kwargs):
    #     payload = request.body
    #     sig_header = request.headers['Stripe-Signature']
    #     try:
    #         event = stripe.Webhook.construct_event(
    #             payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
    #         )
    #     except ValueError as e:
    #         # Invalid payload
    #         return HttpResponse(status=400)
    #     except stripe.error.SignatureVerificationError as e:
    #         # Invalid signature
    #         return HttpResponse(status=400)
    #     # Handle the event
    #     if event['type'] == 'payment_intent.succeeded':
    #         payment_intent = event['data']['object']
    #         ##print("Payment succeeded:", payment_intent['id'])
    #         invoice_id = event['data']['object']['invoice']
    #         time.sleep(15)
    #         user = models.CustomUser.objects.get(stripe_checkout_id=invoice_id)
    #         user.is_Premium_user = True
    #         user.save()
    #         ##print("Successfull")
    #     elif event['type'] == 'payment_intent.payment_failed':
    #         payment_intent = event['data']['object']
    #         # Process payment failure
    #         ##print("Payment failed:", payment_intent['id'])
    #     # Add more event types as needed
    #     # Respond with a 200 OK to acknowledge receipt of the event
    #     return HttpResponse(status=200)
account_sid = config('TWILIO_ACCOUNT_SID')
auth_token = config("TWILIO_AUTH_TOKEN")
twilio_phone = config("TWILIO_PHONE")
client = TwilioClient(account_sid, auth_token)
class PhoneViewset(viewsets.ModelViewSet):
    """when user added its phonenumber, then this function will call"""
    queryset = PhoneNumber.objects.all()
    serializer_class = PhoneNumberSerializer
    permission_classes = (permissions.IsAuthenticated,)
    def perform_create(self, serializer):
        '''Associate user with phone number'''
        serializer.save(user=self.request.user)
class SendSmsCode(APIView):
    """Twilio OTP function"""
    def get(self, request):
        """get function"""
        try:
            user = models.CustomUser.objects.get(email=request.query_params.get('email'))
            # Time based otp
            time_otp = pyotp.TOTP(user.key, interval=300).now()
            # Phone number must be international and start with a plus '+'
            user_phone_number = user.phonenumber.number

            client.messages.create(
                body="Your verification code is " + time_otp,
                from_=twilio_phone,
                to=user_phone_number
            )
            return JsonResponse({'message': 'SMS code sent successfully'},
            status=200)
        except models.CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User with the provided email does not exist'},
            status=404)
        except TwilioException as e:
            print(e)
            return JsonResponse({'error': 'Failed to send SMS code: {}'.format(str(e))},
            status=500)
class VerifyPhone(APIView):
    """Twilio OTP function, verifies the number"""

    def get(self, request, sms_code):
        """get function"""
        user = models.CustomUser.objects.get(
        email=request.query_params.get('email'))
        code = int(sms_code)
        if user.authenticate(code):
            phone = user.phonenumber
            phone.verified=True
            phone.save()
            return Response(dict(detail='Verified'))
        return Response(dict(detail='The provided code did not match or has expired'),
        status=404)
class VerifyEmail_(APIView):
    """Twilio OTP function, verifies the mail(TWILIO, MAIL TRAP)"""
    def get(self, request):
            """get function"""
            access_token_encode = request.headers['Authorization']
            access_token = jwt.decode(access_token_encode.split(' ')[1],
            verify=False,
            options={'verify_signature': False})
            user_id = access_token['user_id']
            user = models.CustomUser.objects.get(pk=user_id)
            time_otp = pyotp.TOTP(user.key, interval=300).now()

            ##print(time_otp)
            send_mail(
                "Email verification Code",
                "Your verification code is " + time_otp,
                "mumertrade8@gmail.com",
                [user.email]
            )
            return Response('Email verification code sent successfully', status=status.HTTP_200_OK)
class VerifyEmail(APIView):
    """Twilio OTP function, verifies the mail(TWILIO, MAIL TRAP) tester"""
    def get(self, request, sms_code):
        """get function"""
        access_token_encode = request.headers['Authorization']
        access_token = jwt.decode(access_token_encode.split(' ')[1],
        verify=False, options={'verify_signature': False})
        user_id = access_token['user_id']
        ##print(user_id)
        user = models.CustomUser.objects.get(pk=user_id)
        code = int(sms_code)
        if user.authenticate(code):
            user.is_verified_email = True
            user.save()
            return Response(dict(detail='Verified'))
        return Response(dict(detail='The provided code did not match or has expired'),
        status=404)
class VerifyRecaptcha(APIView):
    """TWILIO TASK CAPTCHA. use the google api key"""
    def post(self, request):
        """post function"""
        captcha_response = request.data['captchaResponse']
        secret_key = '6Ld6dacpAAAAAC2X-o45voi3fu1ZRdlT7RMTXL5X'
        data = {
            'response': captcha_response,
            'secret': secret_key
        }
        response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=data)
        result = response.json()
        if result['success']:
            # reCAPTCHA verification successful
            return JsonResponse({'message': 'reCAPTCHA verification successful'})
        else:
            # reCAPTCHA verification failed
            return JsonResponse({'error': 'reCAPTCHA verification failed'}, status=400)
from django.db.models import Q
from django.core.cache import cache
class GetAllNotification(APIView):
    """retrive notification and store it in cache for faster access"""
    def get(self, request):
        """get function"""
        access_token_encode = request.headers['Authorization']
        access_token = jwt.decode(access_token_encode.split(' ')[1],
        verify=False,
        options={'verify_signature': False})
        user_id = access_token['user_id']
        notifications = models.Notification.objects.filter(
        Q(to_user=user_id) | Q(is_post_notification=True))
        # notifications = models.Notification.objects.all()
        ser = serializers.NotificationSerializers(
        notifications, many=True)
        # print(ser.data)
        cache.set('notification_in_Cache', ser.data, 30)
        if ser.is_valid:
            return Response(ser.data)
        return Response("error")
        # notification_in_Cache = cache.get("notification_in_Cache")
        # if notification_in_Cache is None:
        #     access_token_encode = request.headers['Authorization']
        #     access_token = jwt.decode(access_token_encode.split(' ')[1],
        #     verify=False, options={'verify_signature': False})
        #     user_id = access_token['user_id']
        #     notifications = models.Notification.objects.filter(Q(to_user=user_id)
        #     | Q(is_post_notification=True))
        #     # notifications = models.Notification.objects.all()
        #     ser = serializers.NotificationSerializers(notifications, many=True)
        #     print(ser.data)
        #     cache.set('notification_in_Cache', ser.data, 30)
        #     if ser.is_valid:
        #         return Response(ser.data)
        #     else:
        #         return Response("error")
        # print("notification_in_Cache", notification_in_Cache)
        # return Response(notification_in_Cache)

from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
class GetEcommerceItems(APIView):
    """get e-commerce items"""

    # @method_decorator(cache_page(60*15, key_prefix="ecommerceItems"))
    def get(self, request):
        """get function"""
        _ = request
        item_from_cache = cache.get("ecommerceItems")
        print("item_from_cache", item_from_cache)
        if item_from_cache == None:
            items = models.Items.objects.all()
            ser = serializers.ItemsSerializer(items, many=True)
            cache.set("ecommerceItems", ser.data, 30)
            return Response(ser.data)
        else:
            return Response(item_from_cache)
class GetEcommerceItemsPerId(APIView):
    """get e-commerce items thru its pk"""
    def get(self, request, pk):
        _ = request
        items = models.Items.objects.get(pk=pk)
        ser = serializers.ItemsSerializer(items)
        return Response(ser.data)

def payment_successfull(request, slug):
    """e-commerce items payment integration(twilio)"""
    print("slug", slug)
    checkout_session_id = request.GET.get('session_id', None)
    session = stripe.checkout.Session.retrieve(checkout_session_id)
    print(session.metadata.get('items'))
    if slug == 'is_subscription':
        email = session['customer_details']['email']
        invoice_id = session['invoice']
        user_payment = models.CustomUser.objects.get(email=email)
        user_payment.stripe_checkout_id = invoice_id
        user_payment.is_Premium_user = True
        user_payment.save()
    elif slug =='is_item_checkout':
        items = json.loads(session.metadata.get('items'))
        for item_data in items:
            item_from_database = models.Items.objects.get(id=item_data['id'])
            item_from_database.stock -= item_data['quantity']
            item_from_database.save()
    return render(request, 'success.html')

class CreateCheckoutSessionAddToCart(APIView):
    """e-commerce items payment integration(twilio)"""
    def post(self, request):
        """post function"""
        items = request.data["cartItems"]
        currency = request.data["cur"]
        sub_id = ''
        if currency == 'USD':
            sub_id='subscription_id'
        elif currency == 'EUR':
            sub_id='subscription_id_eur'
        else:
            sub_id='subscription_id_de'

        line_items = []
        relevent_stuff_items = []
        for item in items:
            relevent_stuff_items.append({
                'id': item['id'], 'quantity': item['quantity']
            })
            line_items.append({
                'price': item[sub_id],
                'quantity': item['quantity'],
            })

            print(items)
        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='subscription',
                success_url=settings.FRONTEND_URL
                +'/success/is_item_checkout?session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.FRONTEND_URL + '/cancel',
                metadata = {
                'items': json.dumps(relevent_stuff_items)
                }

            )
        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=500)
        # for item_data in items:
        #     item_from_database = models.items.objects.get(id=item_data['id'])
        #     item_from_database.stock -= item_data['quantity']
        #     item_from_database.save()
        return Response(checkout_session.url)

def wrap_string_into_list(text, line_length):
    print("text", text)
    wrapped_lines = textwrap.wrap(text, width=line_length)
    return wrapped_lines
class JsonIntoPdfExport(APIView):
    """trello task to upload the the data of post into pdf"""

    def post(self, request):
        """post function"""
        try:
            datas = request.data['data']
            df = pd.DataFrame(datas)
            pdf = FPDF()
            columns = df.columns.tolist()
            pdf.add_page()
            pdf.set_font("Arial", size=6)
            for _, row in df.iterrows():
                count = 0
                for value in row:
                    if count == 5:
                        lines = wrap_string_into_list(str(value), 100)
                        for line in lines:
                            pdf.cell(10, 5, line)
                            pdf.ln()
                    else:
                        st = str(columns[count]) + ": " + str(value)
                        pdf.cell(10, 5, st)
                    count=count+1
                    pdf.ln()
            # pdf.output("C:/Users/M Umer/Downloads/data.pdf")
            pdf.output("/downloads/data.pdf")
            return Response("pdf file downloaded")
        except Exception as e:
            return Response(e)
class JsonIntoCsvExport(APIView):
    """trello task to upload the the data of post into pdf"""
    def post(self, request):
        """post function"""
        data = request.data['data']
        csv_filename = '/downloads/data.csv'
        try:
            df = pd.DataFrame(data)
            df.to_csv(csv_filename, index=False)
            return Response("CSV file has been created successfully.")
        except Exception as e:
            return Response("Error:", e)
class ReportToInsertDatabase(APIView):
    """trello task to upload the bulk post into database"""
    def post(self, request):
        """post function"""
        file = request.FILES['file']
        data = StringIO(file.read().decode('utf-8'))
        df = pd.read_csv(data)
        jsons = df.to_json(orient='records')
        parsed_jsons = json.loads(jsons)
        for j in parsed_jsons:
            tags = []
            for tag in j['tags'].split(', '):
                tags.append(models.Tag.objects.get(tag_name=tag))
            category = models.Category.objects.get(Category_name = j['Category'])
            user_instance = models.CustomUser.objects.get(pk=1)
            post = models.Post.objects.create(user_id=user_instance,
            Category=category,
            Post_Textfield=j['Post_Textfield'],
            content=j['content'],
            image_Field=j['image_Field'])
            post.tags.set(tags)
        return Response("Successfully upload the bulk post")

# class PublisherDocumentView(DocumentViewSet):
#     document = PostDocument
#     serializer_class = serializers.NewsDocumentSerializer
#     lookup_field = 'first_name'
#     fielddata=True
#     filter_backends = [
#         FilteringFilterBackend,
#         CompoundSearchFilterBackend,
#     ]
#     search_fields = (
#         'Post_Textfield',
#         'content',
#     )
#     multi_match_search_fields = (
#        'Post_Textfield',
#         'content',
#     )
#     filter_fields = {
#        'Post_Textfield' : 'Post_Textfield',
#         'content' : 'content',
#     }

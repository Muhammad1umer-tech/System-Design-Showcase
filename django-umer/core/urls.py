"""it has all the api that has been used in the frontend"""
from django.urls import path, include
from rest_framework import routers
from rest_framework.routers import DefaultRouter
from . import views

router = routers.SimpleRouter()
router.register(r'phones', views.PhoneViewset)
router = DefaultRouter()
router.register(r'posts', views.PostViewSet)

urlpatterns = [
    # category urls
    path('create_cateogry/', views.CreateCategory.as_view()),
    path('see_category/', views.SeeCategory.as_view()),
    path('update_category/<int:pk>/', views.UpdateCategory.as_view()),
    path('delete_category/<int:pk>/', views.DeleteCategory.as_view()),
    path('see_tags/', views.SeeTags.as_view()),
    # posts
    path('create_post/', views.CreatePost.as_view(), name='create_post_url'),
    path('get_all_post/', views.GetAllPost.as_view(), name='get_all_post'),
    path('get_all_post_admin/', views.GetAllPostAdmin.as_view()),
    path('get_post/<int:pk>', views.GetPost.as_view(), name='get_post'),
    # implemented timezone and session
    path('get_post_premium/<int:pk>', views.GetPostPremium.as_view()),
    # implemented timezone and session
    path('edit_post/<int:pk>', views.EditPost.as_view()),
    path('get_specific_post/<int:pk>', views.GetSpecificPost.as_view()),
    path('show_trending_posts/', views.ShowTrendingPost.as_view()),
    # views
    path('show_popular_posts/', views.ShowPopularPosts.as_view()),
    path('show_top_posts/', views.ShowTopPosts.as_view()),
    path('show_featured_posts/', views.ShowFeaturedPosts.as_view()),
    path('get_category_posts/<str:category>/',
    views.GetCategoryPosts.as_view(),
    name='get_category_posts'),
    path('get_tag_posts/<str:tag>/', views.GetTagPosts.as_view(), name='get_tag_posts'),
    path('show_all_category_post/', views.ShowAllCategoryPost.as_view()),
    #like and comment
    path('like/', views.LikeThePostAndComment.as_view()),
    path('comment/', views.CommentOnPostOrComment.as_view()),
    path('get_reply_comment/<int:pk>', views.GetReplyComment.as_view()),
    path('get_all_level_comment/<int:pk>', views.GetAllLevelComment.as_view()),
    #get comment
    path('get_comment/<int:pk>', views.GetComment.as_view()),
    path('get_post_schedule/', views.ShowAllPostScheduleTask.as_view()),
    #gmail
    path('send_email/', views.SendEmailAPIView.as_view()),
    path('ckeditor/', include('ckeditor_uploader.urls')),
    # path('ret_upd_del_create_post/<int:pk>', views.ret_upd_del_create_post.as_view()),
    path('pagination/', views.Paginate.as_view()),
    path('notify_everyone_about_the_post/', views.NotifyEveryoneAboutThePost.as_view()),
    # post-with comment and like
    path('post_along_comment_like/<int:pk>', views.PostAlongCommentLike.as_view()),
    path('send_mail/', views.SendEmail.as_view()),
    path('adding_views/', views.AddingViews.as_view()),
    path('premiumDetails/',
    views.PremiumDetails.as_view(),
    name="payment"),
    path('payment/' , views.HomepageView.as_view(), name="payment"),
    path('payment/create-checkout-session/',
    views.CreateCheckoutSession.as_view(),
    name='create_checkout_session'),
    path('payment/create-checkout-session-add-to-cart/',
    views.CreateCheckoutSessionAddToCart.as_view(),
    name='create_checkout_session'),
    path('success/<slug:slug>/' , views.payment_successfull),
    # path('stripe_webhooks/', views.StripeWebhook.as_view())
    path('send_sms_code/',views.SendSmsCode.as_view()),
    path('send_sms_code_to_email/',views.VerifyEmail_.as_view()),
    path('verify_phone/<int:sms_code>',views.VerifyPhone.as_view()),
    path('verify_email/<int:sms_code>',views.VerifyEmail.as_view()),
    path('verify-recaptcha/', views.VerifyRecaptcha.as_view(),
    name='verify_recaptcha'),
    path('get_all_notification/', views.GetAllNotification.as_view()),
    path('get_ecommerce_items/', views.GetEcommerceItems.as_view()),
    path('get_ecommerce_items_per_id/<int:pk>',
    views.GetEcommerceItemsPerId.as_view()),
    path('json_into_csv_Export/',
    views.JsonIntoCsvExport.as_view()),
    path('json_into_pdf_Export/',
    views.JsonIntoPdfExport.as_view(),
    name='generate_pdf'),
    path('report_to_insert_database/',
    views.ReportToInsertDatabase.as_view(),
    name='generate_pdf'),

    path('', include(router.urls)),
]
urlpatterns += router.urls

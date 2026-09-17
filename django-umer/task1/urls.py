from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from graphene_django.views import GraphQLView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("graphql", GraphQLView.as_view(graphiql=True)),
    # path('api-auth/', include('drf_social_oauth2.urls',namespace='drf')),
    path('', include("core.urls")),
    path('auth/', include("accounts.urls")),
    path('ad/', include("admin_auth.urls")),
    path('social_auth/', include("google_auth.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)









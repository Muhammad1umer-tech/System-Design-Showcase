from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from core import serializers
from core import models
import requests
class GoogleAuth(APIView):
    def post(self, request):
        token = request.data.get('tokenObj', {}).get('id_token', None)
        if token:
            verification_url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + token
            response = requests.get(verification_url)
            if response.status_code == 200:
                try:
                    user = models.CustomUser.objects.get(email=response.json()['email'])
                    refresh = RefreshToken.for_user(user)
                    access = refresh.access_token
                    return Response({
                        'refresh': str(refresh),
                        'access': str(access)})

                except models.CustomUser.DoesNotExist:
                    data = {
                        'username':response.json()['given_name'],
                        'password':'random',
                        'email':response.json()['email'],
                    }

                    user = models.CustomUser.objects.create(
                    email=data['email'],
                    password=data['password'],
                    username=data['username'],
                    is_social_login = True,
                    )

                    refresh = RefreshToken.for_user(user)
                    access = refresh.access_token
                    return Response({
                        'refresh': str(refresh),
                        'access': str(access)})
class home(APIView):
    permission_classes = (IsAuthenticated, )
    def get(self, request):
        content = {'message': 'Welcome to the Social Authentication '}
        return Response(content)

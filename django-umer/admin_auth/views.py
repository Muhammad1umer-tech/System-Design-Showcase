from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from core import serializers, models
class Login(APIView):
    def post(self, request):
        data = request.data
        email = data['email']
        password = data['password']
        try:
            user_instance = models.CustomUser.objects.get(email=email)
        except models.CustomUser.DoesNotExist:
            return Response("Wrong email, Please enter Correct email", status=400)
        if user_instance.is_superuser is False and user_instance.is_creator is False and user_instance.is_editor is False:
            return Response("Your are not the admin", status=400)
        user = authenticate(request, email=email, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token
            json_user = serializers.UserSerializers(user_instance)
            
            login(request, user)
            permission = ''
            if(user_instance.is_creator) :
                permission = 'creator' 
            elif(user_instance.is_editor) :
                permission = 'editor'
            else:
                permission = 'admin'
            return Response({
                "Message": "Successfully Logged " + permission,
                'refresh': str(refresh),
                'access': str(access),
                'user': json_user.data,
                'permission': permission
            })
        else:
            return HttpResponse('Invalid credentials', status=400)
    
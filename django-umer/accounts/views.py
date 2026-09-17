from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
import jwt
from core import serializers, models
from rest_framework import status

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
class Register(APIView):
    def post(self, request):
        data = request.data.copy()
        if data['phonenumber'] is None or data['phonenumber'] == '':
            return Response("Enter Phonenumber Please", status.HTTP_400_BAD_REQUEST)
        user_ser = serializers.UserSerializers(data=data)
        if user_ser.is_valid():
            user_ser.save()
            user_instance = models.CustomUser.objects.get(email=request.data['email'])
            models.PhoneNumber.objects.create(
                user=user_instance,
                number=request.data['phonenumber']
            )
            print(user_ser.data)
            return Response("Registration Successfull", status.HTTP_201_CREATED)
        else:
            print(user_ser.data)
            message = user_ser.errors
            if user_ser.data['email'] == '':
                message = 'Enter mail please'
            elif user_ser.data['password'] == '':
                message = 'Enter password please'
            elif user_ser.data['username'] == '':
                message = 'Enter username please'


            return Response(message, status.HTTP_400_BAD_REQUEST)

class Login(APIView):
    def post(self, request):
        data = request.data
        email = data['email']
        password = data['password']
        print(data)
        try:
            user_instance = models.CustomUser.objects.get(email=email)
        except models.CustomUser.DoesNotExist:
            return Response("Wrong email, Please enter Correct email", status.HTTP_400_BAD_REQUEST)
        if user_instance.is_social_login is True:
                return Response("User doesn't exist", status.HTTP_400_BAD_REQUEST)
        user = authenticate(request, email=email, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token
            json_user = serializers.UserSerializers(user_instance)
            login(request, user)
            return Response({
                'refresh': str(refresh),
                'access': str(access),
                'user': json_user.data,
            }, status.HTTP_200_OK)
        return Response('Invalid credentials', status.HTTP_400_BAD_REQUEST)

def Logout(request):
    if request.user.is_authenticated:
        logout(request)
        return HttpResponse("Logout Successfully")
    return HttpResponse("Already Logout")

class get_user_details(APIView):
    def get(self, request):
        try:
            access_token_encode = request.headers['Authorization']
            access_token = jwt.decode(access_token_encode.split(' ')[1], verify=False, options={'verify_signature': False})
            user_id = access_token['user_id']
            user = models.CustomUser.objects.get(pk=user_id)
            user_json = serializers.UserSerializers(user)
            return Response(user_json.data, status.HTTP_200_OK)
        except Exception:
            return Response(status.HTTP_401_UNAUTHORIZED)

# class get_user_details_not_exp(APIView):
#     def get(self, request):
#         print(request.headers['Authorization'])
#         access_token_encode = request.headers['Authorization']
#         print(access_token_encode)
#         access_token = jwt.decode(access_token_encode, None, None)
#         exp = access_token['exp']
#         user_id = access_token['user_id']
#         current_time = time.time()
#         # print(exp, user_id, current_time)
#         if exp < current_time:
#             return Response("Token Expired", status=status.HTTP_401_UNAUTHORIZED)
#         user = models.CustomUser.objects.get(pk=user_id)
#         user_json = serializers.UserSerializers(user)
#         return Response(user_json.data)
class edit_user_details(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        try:
            data = request.data
            user = models.CustomUser.objects.get(pk=pk)
            user.username = data['username']
            user.email = data['email']
            print("aa")
            user.save()
            return Response("User edited Successfull", status.HTTP_200_OK)
        except Exception:
            return Response("Please enter all details", status.HTTP_400_BAD_REQUEST)
class show_post(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        posts = models.Post.objects.all()
        serializer = serializers.PostSerializer(posts, many=True)
        return Response(serializer.data, status.HTTP_200_OK)


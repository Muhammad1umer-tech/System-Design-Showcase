from django.test import TestCase
from django.contrib.auth import get_user_model
import jwt
from rest_framework import status
from core.models import PhoneNumber, Post, Category, Tag
from rest_framework.authtoken.models import Token
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from core.models import CustomUser
class CustomUserTests(TestCase):
    def setUp(self):
        self.email = 'testuser@example.com'
        self.username = 'testuser@example.com'
        self.password = 'testpassword'
        self.super_email = 'admin@example.com'
        self.super_password = 'superpassword'

    def test_create_user(self):
        user = get_user_model().objects.create_user(email="testuser@example.com", username='testuser', password='testpassword')
        self.assertEqual(user.email, self.email)
        self.assertTrue(user.check_password(self.password))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        user = get_user_model().objects.create_user(email="testuser@example.com", username='testuser', password='testpassword', is_superuser=True)
        self.assertEqual(user.email, self.email)
        self.assertTrue(user.check_password(self.password))
        self.assertFalse(user.is_staff)
        self.assertTrue(user.is_superuser)

    def test_create_user_without_email(self):
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user(email='', password=self.password)

class RegisterAPITestCase(APITestCase):
    def setUp(self):
        self.url = reverse('register')
        self.valid_payload = {
            'email': 'testuser@example.com',
            'username': 'testuser',
            'password': 'testpassword',
            'phonenumber': '1234567890'
        }
        self.invalid_payload = {
            'email': '',
            'username': '',
            'password': '',
            'phonenumber': ''
        }

    def test_register_valid_user(self):
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, "Registration Successfull")
        self.assertTrue(CustomUser.objects.filter(email=self.valid_payload['email']).exists())
        self.assertTrue(PhoneNumber.objects.filter(number=self.valid_payload['phonenumber']).exists())

    def test_register_invalid_user_no_phonenumber(self):
        invalid_payload = self.valid_payload.copy()
        invalid_payload['phonenumber'] = ''
        response = self.client.post(self.url, invalid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Enter Phonenumber Please")

    def test_register_invalid_user_no_email(self):
        invalid_payload = self.valid_payload.copy()
        invalid_payload['email'] = ''
        response = self.client.post(self.url, invalid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'Enter mail please')

    def test_register_invalid_user_no_password(self):
        invalid_payload = self.valid_payload.copy()
        invalid_payload['password'] = ''
        response = self.client.post(self.url, invalid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'Enter password please')

    def test_register_invalid_user_no_username(self):
        invalid_payload = self.valid_payload.copy()
        invalid_payload['username'] = ''
        response = self.client.post(self.url, invalid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'Enter username please')


class LoginAPITestCase(APITestCase):
    def setUp(self):
        self.url = reverse('login')
        self.email = 'admin@gmail.com'
        self.password = '123'
        self.user = get_user_model().objects.create_user(email=self.email, password=self.password)
        self.valid_payload = {
            'email': 'admin@gmail.com',
            'password': '123',
        }

    def test_login_valid_user(self):
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_register_invalid_user_no_email(self):
        invalid_payload = self.valid_payload.copy()
        invalid_payload['email'] = ''
        response = self.client.post(self.url, invalid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Wrong email, Please enter Correct email")

    def test_register_invalid_user_no_password(self):
        invalid_payload = self.valid_payload.copy()
        invalid_payload['password'] = ''
        response = self.client.post(self.url, invalid_payload, format='json')
        self.assertEqual(response.data, "Invalid credentials")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LogoutViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(email='testuser@gmail.com', password='testpassword')
        self.url = reverse('logout')

    def test_logout_authenticated_user(self):
        self.client.login(email='testuser@gmail.com', password='testpassword')
        response = self.client.get(self.url)
        self.assertEqual(response.content.decode(), "Logout Successfully")
        self.assertEqual(response.status_code, 200)
        response = self.client.get(self.url)
        self.assertEqual(response.content.decode(), "Already Logout")

    def test_logout_unauthenticated_user(self):
        response = self.client.get(self.url)
        self.assertEqual(response.content.decode(), "Already Logout")
        self.assertEqual(response.status_code, 200)


# pytest --cov=accounts --cov-report=html

class UserDetailsTest(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(email="testuser@example.com", username='testuser', password='testpassword')
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        self.url = reverse('get_user_details')

    def test_get_user_details_success(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.user.pk)
        self.assertEqual(response.data['username'], self.user.username)
        self.assertEqual(response.data['email'], self.user.email)

    def test_get_user_details_unauthorized(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class EditUserDetailsTextCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.email = 'admin@gmail.com'
        self.password = '123'
        self.username = 'admin'
        self.user = get_user_model().objects.create_user(email=self.email, password=self.password, username=self.username)
        self.valid_payload = {
            'email': 'admin@gmail.com',
            'username': 'admin',
        }
        self.url = reverse('edit_user_details', kwargs={'pk': self.user.pk})

    def test_edit_posts_authenticated_correct(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_edit_posts_authenticated_incorrect(self):
        self.client.force_authenticate(user=self.user)
        valid_payload = self.valid_payload.copy()
        del valid_payload['email']
        response = self.client.post(self.url, valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Please enter all details")

    def test_edit_posts_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ShowPostTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('show_post')
        self.email = 'admin@gmail.com'
        self.password = '123'
        self.user = get_user_model().objects.create_user(email=self.email, password=self.password)

    def test_get_posts_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_posts_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

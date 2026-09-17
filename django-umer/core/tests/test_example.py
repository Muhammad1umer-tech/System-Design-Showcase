# tests.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from core.models import PhoneNumber, Post, Category, Tag
from rest_framework.authtoken.models import Token
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from core.models import CustomUser
class PostModelTests(TestCase):

    def setUp(self):
        # Create a user
        self.client = APIClient()

        self.user = get_user_model().objects.create_user(email="email@gmail.com", username='testuser', password='testpassword')
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)

        # Create a category
        self.category = Category.objects.create(Category_name='Test Category')
        # Create tags
        self.tag1 = Tag.objects.create(tag_name='Tag1')
        self.tag2 = Tag.objects.create(tag_name='Tag2')
        # Create a post
        self.post = Post.objects.create(
            Post_Textfield='Test Post',
            content='This is a test content for the post.',
            image_Field='images/1547152841305_2oFrYhq.jpg',
            Category=self.category,
            user_id=self.user,
            views=100,
            Featured=True,
            Top=False,
            like=10,
            Comment=5,
            isPremium=False,
            scheduling_date_time='2024-01-01T12:00:00Z'
        )
        self.post.tags.set([self.tag1, self.tag2])

    def test_post_creation(self):
        self.assertEqual(self.post.Post_Textfield, 'Test Post')
        self.assertEqual(self.post.content, 'This is a test content for the post.')
        self.assertEqual(str(self.post.image_Field), 'images/1547152841305_2oFrYhq.jpg')
        self.assertEqual(self.post.Category, self.category)
        self.assertEqual(self.post.user_id, self.user)
        self.assertEqual(self.post.views, 100)
        self.assertTrue(self.post.Featured)
        self.assertFalse(self.post.Top)
        self.assertEqual(self.post.like, 10)
        self.assertEqual(self.post.Comment, 5)
        self.assertFalse(self.post.isPremium)
        self.assertEqual(self.post.scheduling_date_time, '2024-01-01T12:00:00Z')
        self.assertIn(self.tag1, self.post.tags.all())
        self.assertIn(self.tag2, self.post.tags.all())

    def test_post_str(self):
        self.assertEqual(str(self.post), 'Test Post')

    def test_post_views_increment(self):
        initial_views = self.post.views
        self.post.views += 1
        self.post.save()
        self.assertEqual(self.post.views, initial_views + 1)

    def test_get_posts(self):
        url = reverse('get_all_post')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Test Post', str(response.data))

    def test_get_post_detail(self):
        url = reverse('get_post', kwargs={'pk': self.post.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['Post_Textfield'], 'Test Post')
        self.assertEqual(response.data['content'], 'This is a test content for the post.')
        self.assertEqual(response.data['image_Field'], '/media/images/1547152841305_2oFrYhq.jpg')
        self.assertEqual(response.data['Category'], self.category.pk)
        self.assertEqual(response.data['user_id'], self.user.pk)
        self.assertEqual(response.data['views'], 100)
        self.assertTrue(response.data['Featured'])
        self.assertFalse(response.data['Top'])
        self.assertEqual(response.data['like'], 10)
        self.assertEqual(response.data['Comment'], 5)
        self.assertFalse(response.data['isPremium'])
        self.assertEqual(response.data['scheduling_date_time'], '2024-01-01T12:00:00Z')
        self.assertIn(self.tag1.tag_name, response.data['tags'])
        self.assertIn(self.tag2.tag_name, response.data['tags'])


    def test_get_post_detail(self):
        url = reverse('get_post', kwargs={'pk': self.post.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['Post_Textfield'], 'Test Post')
        self.assertEqual(response.data['content'], 'This is a test content for the post.')
        self.assertEqual(response.data['image_Field'], '/media/images/1547152841305_2oFrYhq.jpg')
        self.assertEqual(response.data['Category'], self.category.pk)
        self.assertEqual(response.data['user_id'], self.user.pk)
        self.assertEqual(response.data['views'], 100)
        self.assertTrue(response.data['Featured'])
        self.assertFalse(response.data['Top'])
        self.assertEqual(response.data['like'], 10)
        self.assertEqual(response.data['Comment'], 5)
        self.assertFalse(response.data['isPremium'])
        self.assertEqual(response.data['scheduling_date_time'], '2024-01-01T12:00:00Z')
        self.assertIn(self.tag1.tag_name, response.data['tags'])
        self.assertIn(self.tag2.tag_name, response.data['tags'])

    def test_create_post_without_category(self):
        data = {
            "Post_Textfield": 'Test Post Without Category',
            "content": 'This is a test content for the post without category.',
            "image_Field": 'images/1547152841305_2oFrYhq.jpg',
            "tags": [self.tag1.pk, self.tag2.pk],
            "scheduling_date_time": '2024-01-01T12:00:00Z'
        }
        url = reverse('create_post_url')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
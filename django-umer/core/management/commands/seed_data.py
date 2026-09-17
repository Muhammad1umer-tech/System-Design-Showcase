# python manage.py seed_data 1

import random
from django.utils import timezone
from django.core.management.base import BaseCommand, CommandError
from django_seed import Seed
from core import models
from faker import Faker
faker = Faker()

def add_category_and_tags(count):
    for _ in range(count):
        cat = models.Category.objects.create(
            Category_name= faker.word())
        cat.save()

    for _ in range(count):
        tag = models.Tag.objects.create(
            tag_name= faker.word())
        tag.save()

def add_post(count):
    for _ in range(count):
        post = models.Post.objects.create(
            Post_Textfield=faker.sentence(),
            content=faker.text(),
            image_Field='posts/image-3.jpg',
            Category=models.Category.objects.order_by('?').first(),
            user_id=models.CustomUser.objects.get(email='admin@gmail.com'),
            views=0,
            Featured=False,
            Top=False,
            like=0,
            Comment=0,
            isPremium=False,
            scheduling_date_time=timezone.now())

        post.tags.set([models.Tag.objects.order_by('?').first()])
        post.save()

def add_subscription():
    subs = models.Subscription.objects.all()

    if(len(subs)>0):
        return

    sub1 = models.Subscription.objects.create(
        name = "Low Premium Product",
        product_id= 'price_1OrbfyFqQzN4IXkpQW0v4zMK',
        price = 500)

    sub2 = models.Subscription.objects.create(
        name = "Premium Post",
        product_id = 'price_1OrbfWFqQzN4IXkpOFCT69yt',
        price = 1000)

    sub3 = models.Subscription.objects.create(
            name = "High Premium Product",
            product_id = 'price_1Orbf4FqQzN4IXkplVYWDNnx',
            price = 2000,
    )
    sub1.save()
    sub2.save()
    sub3.save()


def add_comment(count):
    for _ in range(count):
        comment = models.Comment.objects.create(
            Text = faker.sentence(),
            Post = models.Post.objects.order_by('?').first(),
            user_id = models.CustomUser.objects.order_by('?').first(),
            like = 0)
        comment.save()

    for _ in range(count):
        comment = models.Comment.objects.create(
            Text = faker.sentence(),
            parent_comment = models.Comment.objects.order_by('?').first(),
            user_id = models.CustomUser.objects.order_by('?').first(),
            like = 0)
        comment.save()

def generate_lEVEL1_comments(count):
    for _ in range(count):
        random_user = models.CustomUser.objects.order_by('?').first()
        Post = models.Post.objects.order_by('?').first()
        comment_data = models.Comment.objects.create(
            Text= faker.sentence(),
            Post= Post,
            user_id= random_user,
            parent_comment= None,
            like= 0)
        comment_data.save()

def generate_Herarchy_comments(count):
    for _ in range(count):
        parent_comment = models.Comment.objects.order_by('?').first()
        comment_data = models.Comment.objects.create(
            Text= faker.sentence(),
            parent_comment= parent_comment,
            Post= parent_comment.Post,
            user_id= models.CustomUser.objects.order_by('?').first(),
            like= 0)
        comment_data.save()

def add_like(count):

    for _ in range(count):
        like = models.Like.objects.create(
            user_id= models.CustomUser.objects.order_by('?').first(),
            comment_id= models.Comment.objects.order_by('?').first(),)
        like.save()

    for _ in range(count):
        like = models.Like.objects.create(
        user_id= models.CustomUser.objects.order_by('?').first(),
        Post_id= models.Post.objects.order_by('?').first(),)
        like.save()

def add_items():
    items = models.Items.objects.all()

    if(len(items) > 0):
        return

    items = models.Items.objects.create(
        discount= 3.5,
        fullDescription = faker.sentence(),
        image = 'posts/image-3.jpg',
        name = faker.sentence(),
        offerEnd = timezone.now(),
        price = random.uniform(10, 50),
        rating = random.uniform(0, 5),
        salesCount = random.randint(10, 50),
        shortDescription = faker.sentence(),
        sku = faker.sentence(),
        user_id = models.CustomUser.objects.get(email='admin@gmail.com'),
        stock = 5,
        subscription_id = "price_1PREKfFqQzN4IXkpQXMVK7uA",
        subscription_id_eur = "price_1PREKfFqQzN4IXkpXXKwcusu",
        subscription_id_de = "price_1PREKfFqQzN4IXkpDWP1TNys")
    items.save()

class Command(BaseCommand):
    help = 'Seed data for the application'

    def add_arguments(self, parser):
        parser.add_argument('count', type=int, help='Number of entries to seed')

    def handle(self, *args, **options):
        count = options['count']
        if count < 1:
            raise CommandError('Count should be a positive integer')


        add_category_and_tags(count)
        add_post(count)
        add_subscription()
        add_like(count)
        add_items()
        add_comment(count)
        generate_lEVEL1_comments(count)
        generate_Herarchy_comments(count)

        # seeder = Seed.seeder()
        # seeder.add_entity(models.Category, count)
        # seeder.add_entity(models.Tag, count)
        # seeder.add_entity(models.Comment, count)
        # add_items(seeder, count)
        # add_subscription(seeder)
        # add_like(seeder, count)
        # inserted_pks = seeder.execute()

        # for pk in inserted_pks[models.Post]:
        #     post = models.Post.objects.get(pk=pk)
        #     tags = [models.Tag.objects.order_by('?').first()]
        #     post.tags.set(tags)

        # generate_lEVEL1_comments(seeder, count)
        # generate_Herarchy_comments(seeder, count)

        # seeder.execute()
        self.stdout.write(self.style.SUCCESS(f'Data seeding completed successfully for {count} entries'))

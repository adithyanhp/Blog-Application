# blog/urls.py

#urls.py is the file where we define the URL patterns for our blog application. It maps URLs to the corresponding views, allowing users to access different parts of the application through specific endpoints.

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, PostViewSet, CommentViewSet, LikeViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'likes', LikeViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]


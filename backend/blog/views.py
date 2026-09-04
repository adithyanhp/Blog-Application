# blog/views.py

#views.py is the file where we define the logic for our API endpoints. It handles incoming requests, interacts with the database through models, and returns responses in JSON format using serializers.

from rest_framework import viewsets
from django.contrib.auth import get_user_model
from .models import Post, Comment, Like
from .serializers import UserSerializer, PostSerializer, CommentSerializer, LikeSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at') # Assuming you have a created_at field
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


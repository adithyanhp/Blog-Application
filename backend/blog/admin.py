from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Post, Comment, Like

# 1. Register Custom User
# We use UserAdmin so the password hashing and permission UI work correctly
admin.site.register(User, UserAdmin)

# 2. Register Post with a customized view
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at', 'updated_at')
    search_fields = ('title', 'content', 'author__username')
    list_filter = ('created_at', 'author')

admin.site.register(Post, PostAdmin)

# 3. Register Comment with a customized view
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'post', 'created_at')
    search_fields = ('content', 'author__username')
    list_filter = ('created_at',)

admin.site.register(Comment, CommentAdmin)

# 4. Register Like with a customized view
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'post')
    search_fields = ('user__username', 'post__title')

admin.site.register(Like, LikeAdmin)


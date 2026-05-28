from django.urls import path
from recommender import views

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.auth_register, name='auth_register'),
    path('auth/login/', views.auth_login, name='auth_login'),
    path('auth/me/', views.get_profile, name='get_profile'),

    # Prediction & Engine endpoints
    path('predict/disease/', views.predict_disease, name='predict_disease'),
    path('predict/recommend-crop/', views.predict_crop, name='predict_crop'),
    


    # History & Statistics endpoints
    path('history/', views.get_history, name='get_history'),
    path('history/stats/', views.get_dashboard_stats, name='get_dashboard_stats'),
]

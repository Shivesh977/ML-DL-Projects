import requests
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta

from recommender.models import UserProfile, Prediction, DiseasePrediction
from recommender.ml_engine import predict_disease_real, predict_recommended_crop


@api_view(['POST'])
@permission_classes([AllowAny])
def auth_register(request):
    """
    Registers a new user, creates their UserProfile and immediately returns an auth token.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')
    phone = request.data.get('phone', '')

    if not username or not password:
        return Response(
            {"error": "Username and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Create standard Django user
    user = User.objects.create_user(username=username, password=password, email=email)
    
    # Create profile
    UserProfile.objects.create(user=user, phone=phone)

    # Create Token
    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        "token": token.key,
        "username": user.username,
        "email": user.email,
        "phone": phone
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def auth_login(request):
    """
    Authenticates a user and returns their token + details.
    """
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {"error": "Username and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)
    if user is None:
        return Response(
            {"error": "Invalid username or password."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    token, _ = Token.objects.get_or_create(user=user)
    
    phone = ""
    if hasattr(user, 'userprofile'):
        phone = user.userprofile.phone

    return Response({
        "token": token.key,
        "username": user.username,
        "email": user.email,
        "phone": phone
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    """
    Returns profile information of the currently authenticated user.
    """
    user = request.user
    phone = ""
    if hasattr(user, 'userprofile'):
        phone = user.userprofile.phone

    return Response({
        "username": user.username,
        "email": user.email,
        "phone": phone
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_disease(request):
    """
    Accepts crop selection and a base64-encoded leaf image, runs model inference,
    saves the detailed report in prediction history, and returns agronomic suggestions.
    """
    crop_type = request.data.get('crop_type')
    image_base64 = request.data.get('image')

    if not crop_type or not image_base64:
        return Response(
            {"error": "Parameters 'crop_type' and 'image' (base64) are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Get AI analysis
        result = predict_disease_real(crop_type, image_base64)
        
        # Save to database log
        DiseasePrediction.objects.create(
            user=request.user,
            crop_type=result["crop_type"],
            disease_name=result["disease_name"],
            confidence=result["confidence"],
            severity=result["severity"],
            yield_impact=result["yield_impact"],
            image_base64=image_base64,
            description=result["description"],
            symptoms=result["symptoms"],
            causes=result["causes"],
            medication=result["medication"],
            precautions=result["precautions"],
            prevention=result["prevention"]
        )
        
        return Response(result, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": f"Leaf inference failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_crop(request):
    """
    Inputs N, P, K, pH, and climate data, runs the Random Forest model to predict
    the best crop to grow, and logs the result under Prediction.
    """
    try:
        n = float(request.data.get('N'))
        p = float(request.data.get('P'))
        k = float(request.data.get('K'))
        temperature = float(request.data.get('temperature'))
        humidity = float(request.data.get('humidity'))
        ph = float(request.data.get('ph'))
        rainfall = float(request.data.get('rainfall'))
    except (TypeError, ValueError):
        return Response(
            {"error": "All parameters N, P, K, temperature, humidity, ph, rainfall must be numbers."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Predict optimal crop
        predicted_crop = predict_recommended_crop(n, p, k, temperature, humidity, ph, rainfall)

        # Log prediction to N-P-K history
        Prediction.objects.create(
            user=request.user,
            N=n, P=p, K=k,
            temperature=temperature,
            humidity=humidity,
            ph=ph,
            rainfall=rainfall,
            predicted_label=predicted_crop
        )

        return Response({
            "recommended_crop": predicted_crop,
            "N": n, "P": p, "K": k,
            "temperature": temperature,
            "humidity": humidity,
            "ph": ph,
            "rainfall": rainfall
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": f"Crop recommendation failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )





@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_history(request):
    """
    Returns user prediction history list.
    """
    predictions = DiseasePrediction.objects.filter(user=request.user)
    data = []
    for p in predictions:
        data.append({
            "id": p.id,
            "crop_type": p.crop_type,
            "disease_name": p.disease_name,
            "confidence": p.confidence,
            "severity": p.severity,
            "yield_impact": p.yield_impact,
            "image": p.image_base64,
            "description": p.description,
            "symptoms": p.symptoms,
            "causes": p.causes,
            "medication": p.medication,
            "precautions": p.precautions,
            "prevention": p.prevention,
            "date": p.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })
    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_stats(request):
    """
    Aggregates user history data to feed graphical charts on the frontend:
    - Counts of diseases per crop
    - Crop health trend over time (Ratio of healthy vs diseased over last 30 days)
    """
    user = request.user
    
    # 1. Total counts by disease names
    disease_counts = DiseasePrediction.objects.filter(user=user).values('disease_name').annotate(count=Count('id')).order_by('-count')
    disease_data = [{"name": item["disease_name"], "value": item["count"]} for item in disease_counts]
    
    # 2. Crop Health Trend (last 30 days)
    today = timezone.now().date()
    start_date = today - timedelta(days=29)
    
    # Fetch all records in last 30 days
    recent_preds = DiseasePrediction.objects.filter(
        user=user,
        created_at__date__gte=start_date
    )
    
    # Group by date
    trend_dict = {}
    for i in range(30):
        d = (start_date + timedelta(days=i)).strftime("%b %d")
        trend_dict[d] = {"date": d, "healthy": 0, "diseased": 0}
        
    for p in recent_preds:
        d_str = p.created_at.strftime("%b %d")
        if d_str in trend_dict:
            if "healthy" in p.disease_name.lower():
                trend_dict[d_str]["healthy"] += 1
            else:
                trend_dict[d_str]["diseased"] += 1
                
    trend_data = list(trend_dict.values())
    
    return Response({
        "disease_distribution": disease_data,
        "health_trend": trend_data,
        "total_scans": DiseasePrediction.objects.filter(user=user).count(),
        "healthy_scans": DiseasePrediction.objects.filter(user=user, disease_name__icontains="healthy").count(),
        "diseased_scans": DiseasePrediction.objects.filter(user=user).exclude(disease_name__icontains="healthy").count()
    }, status=status.HTTP_200_OK)

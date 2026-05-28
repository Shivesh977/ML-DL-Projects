from django.db import models

# Create your models here.
from django.contrib.auth.models import User  # we store user name email etc 

class UserProfile(models.Model): # user builtin model
    user=models.OneToOneField(User,on_delete=models.CASCADE)  # one to one ..model every user has one profile if user gets deleted its profile also gets deleted 
    phone =models.CharField(max_length=15)
    
    
    def __str__(self):
        return self.user.get_full_name() or self.user.username   # gives both first and last name or give user name 
    
    
class  Prediction(models.Model): # user builtin model
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name='predictions')  # one to one ..model every user has one profile if user gets deleted its profile also gets deleted 
    N =models.FloatField() 
    P=models.FloatField() 
    K=models.FloatField() 
    temperature=models.FloatField() 
    humidity=models.FloatField() 
    ph=models.FloatField() 
    rainfall=models.FloatField() 
    predicted_label=models.CharField(max_length=100) 
    created_at=models.DateTimeField(auto_now_add=True)
    
    class Meta: # order in which results should be shown last result should be shown first 
        ordering =['-created_at']
    
    def __str__(self):
        return f"{self.user.username} ->  {self.predicted_label}"


class DiseasePrediction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='disease_predictions')
    crop_type = models.CharField(max_length=50)  # Tomato, Potato, Corn, etc.
    disease_name = models.CharField(max_length=100)
    confidence = models.FloatField()
    severity = models.CharField(max_length=20)  # Mild, Moderate, Severe
    yield_impact = models.CharField(max_length=50)  # e.g., "25-35%"
    image_base64 = models.TextField(blank=True, null=True)  # Base64 representation of leaf image

    # Agronomic Details
    description = models.TextField()
    symptoms = models.TextField()
    causes = models.TextField()
    medication = models.JSONField()  # JSON listing recommendations
    precautions = models.JSONField()  # list of precautions/next steps
    prevention = models.JSONField()  # list of prevention tips

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} -> {self.crop_type} ({self.disease_name})"

    
import os
import django

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "crop_site.settings")
django.setup()

from recommender.models import Prediction, DiseasePrediction

print("==============================================================")
print("              AGROVISION AI DATABASE RECORDS                  ")
print("==============================================================")

print("\n[+] 1. SOIL RECOMMENDATION RECORDS (Prediction table)")
print("-" * 110)
predictions = Prediction.objects.all()
if not predictions.exists():
    print("No soil recommendation records found.")
else:
    print(f"{'ID':<4} | {'Farmer':<12} | {'Nutrients (N-P-K)':<20} | {'pH':<5} | {'Rain (mm)':<9} | {'Recommended Crop':<18} | {'Date'}")
    print("-" * 110)
    for p in predictions:
        nutrients = f"N={p.N}, P={p.P}, K={p.K}"
        date_str = p.created_at.strftime("%Y-%m-%d %H:%M")
        print(f"{p.id:<4} | {p.user.username:<12} | {nutrients:<20} | {p.ph:<5.1f} | {p.rainfall:<9.1f} | {p.predicted_label:<18} | {date_str}")

print("\n\n[+] 2. LEAF DISEASE DIAGNOSES RECORDS (DiseasePrediction table)")
print("-" * 110)
diseases = DiseasePrediction.objects.all()
if not diseases.exists():
    print("No leaf disease diagnostic records found.")
else:
    print(f"{'ID':<4} | {'Farmer':<12} | {'Crop Type':<12} | {'Diagnosed Disease':<38} | {'Severity':<8} | {'Conf.':<6} | {'Date'}")
    print("-" * 110)
    for d in diseases:
        date_str = d.created_at.strftime("%Y-%m-%d %H:%M")
        # Truncate disease name if too long for table spacing
        name = d.disease_name[:35] + "..." if len(d.disease_name) > 35 else d.disease_name
        print(f"{d.id:<4} | {d.user.username:<12} | {d.crop_type:<12} | {name:<38} | {d.severity:<8} | {d.confidence:>5.1f}% | {date_str}")
print("==============================================================")

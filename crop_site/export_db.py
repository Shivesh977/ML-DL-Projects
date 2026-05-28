import os
import csv
import django

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "crop_site.settings")
django.setup()

from recommender.models import Prediction, DiseasePrediction

def export_data():
    # 1. Export Soil History to CSV
    soil_csv_path = "soil_recommendation_history.csv"
    with open(soil_csv_path, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["ID", "Farmer/User", "N", "P", "K", "pH", "Rainfall (mm)", "Recommended Crop", "Date Saved"])
        for p in Prediction.objects.all():
            writer.writerow([
                p.id,
                p.user.username,
                p.N,
                p.P,
                p.K,
                p.ph,
                p.rainfall,
                p.predicted_label,
                p.created_at.strftime("%Y-%m-%d %H:%M")
            ])
            
    # 2. Export Leaf Disease History to CSV (Skipping heavy base64 strings so it remains perfectly human-readable!)
    disease_csv_path = "leaf_disease_history.csv"
    with open(disease_csv_path, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["ID", "Farmer/User", "Crop Type", "Diagnosed Disease", "Confidence", "Severity", "Impact", "Date Saved"])
        for d in DiseasePrediction.objects.all():
            writer.writerow([
                d.id,
                d.user.username,
                d.crop_type,
                d.disease_name,
                f"{d.confidence:.1f}%",
                d.severity,
                d.yield_impact,
                d.created_at.strftime("%Y-%m-%d %H:%M")
            ])

    # 3. Export to a beautiful, clean Text File (database_records.txt)
    txt_path = "database_records.txt"
    with open(txt_path, mode="w", encoding="utf-8") as file:
        file.write("=========================================================================\n")
        file.write("                  AGROVISION AI DATABASE - HUMAN READABLE                \n")
        file.write("=========================================================================\n\n")
        
        file.write("[+] PART 1: SOIL CROP RECOMMENDATION RECORDS\n")
        file.write("-" * 95 + "\n")
        file.write(f"{'ID':<4} | {'Farmer':<12} | {'Nutrients (N-P-K)':<20} | {'pH':<5} | {'Rain (mm)':<9} | {'Recommended Crop':<18} | {'Date'}\n")
        file.write("-" * 95 + "\n")
        for p in Prediction.objects.all():
            nutrients = f"N={p.N}, P={p.P}, K={p.K}"
            date_str = p.created_at.strftime("%Y-%m-%d %H:%M")
            file.write(f"{p.id:<4} | {p.user.username:<12} | {nutrients:<20} | {p.ph:<5.1f} | {p.rainfall:<9.1f} | {p.predicted_label:<18} | {date_str}\n")
            
        file.write("\n\n" + "=" * 95 + "\n\n")
        
        file.write("[+] PART 2: LEAF DISEASE DIAGNOSTIC RECORDS\n")
        file.write("-" * 95 + "\n")
        file.write(f"{'ID':<4} | {'Farmer':<12} | {'Crop Type':<12} | {'Diagnosed Disease':<30} | {'Severity':<8} | {'Conf.':<6} | {'Date'}\n")
        file.write("-" * 95 + "\n")
        for d in DiseasePrediction.objects.all():
            date_str = d.created_at.strftime("%Y-%m-%d %H:%M")
            name = d.disease_name[:27] + "..." if len(d.disease_name) > 27 else d.disease_name
            file.write(f"{d.id:<4} | {d.user.username:<12} | {d.crop_type:<12} | {name:<30} | {d.severity:<8} | {d.confidence:>5.1f}% | {date_str}\n")
            
        file.write("\n" + "=" * 95 + "\n")

    print("[SUCCESS] Database successfully exported to human-readable files!")
    print(f" -> CSV Soil History: {soil_csv_path}")
    print(f" -> CSV Leaf History: {disease_csv_path}")
    print(f" -> Beautiful Text Report: {txt_path}")

if __name__ == "__main__":
    export_data()

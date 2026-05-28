# AgroVision AI - Technical Architecture & Processing Pipeline

This document details the **Tech Stack**, **Inference Pipelines**, and **Execution Flow** of the AgroVision AI system. It is structured to be directly integrated into your project thesis, report, or presentation slides.

---

## 💻 Tech Stack Summary

The project utilizes a decoupled, high-performance web architecture consisting of an active React Single Page Application (SPA) communicating over a secure JSON API with a Django REST API.

| Layer | Technology | Role & Details |
| :--- | :--- | :--- |
| **Frontend UI** | **React 19 (Vite SPA)** | High-speed, responsive, interactive single-page canvas. |
| **Styling** | **Tailwind CSS v4** | Custom-themed utility engine providing advanced glassmorphism grids. |
| **Icons** | **Lucide React** | Lightweight, high-quality, modern stroke vectors. |
| **Backend Core** | **Django 5.0** | Secure, structured Python application framework. |
| **Web REST API** | **Django REST Framework (DRF)** | Standardized HTTP REST controllers with serializing capabilities. |
| **Authentication** | **DRF TokenAuthentication** | Secure database-backed unique session keys (`Authorization: Token <key>`). |
| **Deep Learning** | **TensorFlow 2.16 & Keras** | Primary deep neural network image inference (Tomato leaf classifier). |
| **Machine Learning** | **Scikit-Learn (Random Forest)** | Soil nutrient N-P-K recommendation engine. |
| **Image Handling** | **Pillow (PIL)** | In-memory base64 image parsing, resizing, and color-space conversion. |
| **External API** | **Open-Meteo Weather API** | Key-free real-time global coordinate climate queries. |
| **Database** | **SQLite 3** | Lightweight relational database containing structured agricultural audit logs. |

---

## 🔄 Step-by-Step Processing Pipeline

Below is the execution flow from the moment the user interacts with the application to the final rendering of reports and charts.

### 🍃 Pipeline A: Leaf Disease Diagnosis (Image Analysis)

```mermaid
sequenceDiagram
    autonumber
    actor Farmer as User/Farmer
    participant Client as React SPA (Client)
    participant Auth as DRF Token Auth
    participant View as Django Disease View
    participant Engine as Dual-Mode ML Engine
    participant TF as TensorFlow Keras Model
    participant Heur as Heuristic Fallback Engine
    participant DB as SQLite Database

    Farmer->>Client: 1. Select Crop Category & Upload Leaf Photo
    Client->>Client: 2. Parse Image to Base64 String
    Client->>Auth: 3. Verify Token Authorization Header
    Auth-->>Client: Token validated successfully
    Client->>View: 4. POST base64 image + crop_type to "/api/predict/disease/"
    View->>Engine: 5. Invoke predict_disease_real(crop_type, base64_img)
    Engine->>Engine: 6. Convert Base64 data to PIL RGB Image
    
    alt Crop Type is Tomato AND Keras Model Available
        Engine->>TF: 7a. Preprocess to 256x256 shape, expand dimensions
        TF->>TF: 8a. Run deep convolutional neural net (CNN) inference
        TF-->>Engine: 9a. Returns class labels & probability array
    else Crop Type is NOT Tomato OR Keras Model offline
        Engine->>Engine: 7b. Downscale to 128x128 pixel dimensions
        Engine->>Engine: 8b. Extract RGB ratios (green, chlorotic, necrotic pixels)
        Engine->>Heur: 9b. Evaluate crop-specific color rules
        Heur-->>Engine: 10b. Returns predicted disease label & confidence
    end

    Engine->>Engine: 11. Match outcome label to DISEASE_DATABASE report
    Engine-->>View: 12. Returns full diagnostic object (severity, organic/chemical medicine)
    View->>DB: 13. Create DiseasePrediction database record (logs base64 preview, loss, etc.)
    View-->>Client: 14. Return 200 OK JSON diagnostic report
    Client->>Client: 15. Render circular confidence gauge, yield impact, and safety medicine cards
```

---

### 🧪 Pipeline B: Soil-Based Crop Recommendation

```mermaid
sequenceDiagram
    autonumber
    actor Farmer as User/Farmer
    participant Client as React SPA (Client)
    participant API as Open-Meteo Weather API
    participant View as Django Crop View
    participant RF as Random Forest Classifier
    participant DB as SQLite Database

    Farmer->>Client: 1. Adjust Soil Nutrient (N-P-K) Sliders
    Farmer->>Client: 2. Click "Auto-detect Weather via GPS"
    Client->>API: 3. Direct GET to api.open-meteo.com using lat/long
    API-->>Client: 4. Returns local temp_2m, relative_humidity, and rain
    Client->>Client: 5. Autofill Temperature, Humidity, and Rainfall parameters
    Farmer->>Client: 6. Click "Recommend Optimal Crop"
    Client->>View: 7. POST N, P, K, pH, temp, humidity, rainfall to "/api/predict/recommend-crop/"
    
    alt Random Forest Model Loaded Successfully
        View->>RF: 8a. Run crop_model.predict([[N, P, K, temp, hum, pH, rain]])
        RF-->>View: 9a. Return recommended crop label
    else RF Model Offline
        View->>View: 8b. Run deterministic agronomic heuristic tree
        View-->>View: 9b. Match thresholds (e.g. high rain/high N -> Rice)
    end

    View->>DB: 10. Create Prediction audit record (logs inputs + recommended crop)
    View-->>Client: 11. Return 200 OK JSON crop recommendation
    Client->>Client: 12. Fetch crop description & render premium result card
```

---

### 📊 Pipeline C: Historical Dashboard & Custom SVG Charting

1.  **Request Logs**: Client queries `/api/history/` and `/api/history/stats/` on tab navigation.
2.  **Database Query**: Django filters `DiseasePrediction.objects.filter(user=request.user)`.
3.  **Aggregate Analytics**: Django counts total uploads, active outbreaks, average diagnostic confidence, and groups them by crop type.
4.  **JSON Payload**: Backend returns clean structured statistical arrays.
5.  **Rendering Custom SVG Canvases**:
    *   **Outbreak Distribution (Bar Chart)**: Client reads data values and maps them dynamically to SVG `<rect>` shapes with custom linear color gradients (`#10B981` to `#059669`).
    *   **30-Day Trends (Area Chart)**: Client maps chronological records into responsive SVG path lines using quadratic curve formatting (`M... Q... C...`) and fills the lower region with a translucent gradient overlay.

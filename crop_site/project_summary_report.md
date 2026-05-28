# AgroVision AI - Smart Plant Disease Detection & Crop Health Assistant

---

## 1. Introduction

### The Agricultural Paradigm & Crop Pathology Challenges
Agriculture forms the backbone of global economies, sustaining populations and driving primary trade. However, crop yield optimization faces catastrophic threats from botanical pathogens, climatic shifts, and improper soil macronutrient configurations. Plant diseases caused by fungi, bacteria, viruses, and insects account for an estimated 20% to 40% of global crop yield losses annually, resulting in multi-billion dollar losses and localized food insecurity.

Smallholder farmers and agricultural enthusiasts often lack immediate access to certified agronomists or expensive scientific soil-testing labs. Traditional visual diagnosis of leaf tissue is highly subjective and prone to diagnostic errors, causing delayed or incorrect chemical treatments that degrade soil quality. 

### The Solution: AI-Driven Digital Agriculture
To address these challenges, **AgroVision AI** was conceptualized. By combining deep learning convolutional neural networks, machine learning soil analytics, and location-based micro-climate indicators, the system bridges the gap between scientific agronomy and real-time field operations. It empowers farmers with instant, localized crop-care diagnostics right in their hands.

---

## 2. What It Is

**AgroVision AI** is a state-of-the-art, full-stack digital agricultural assistant and decision-support system. Designed as an academic minor project, the system implements a decoupled, modern architecture:

1.  **React 19 + Tailwind CSS v4 Frontend Canvas**: A premium, highly responsive user interface designed with sleek glassmorphism panels, glowing indicator borders, custom visual gauges, and interactive native SVG charts.
2.  **Django REST API + SQLite Relational Database**: A secure, scalable Python-based backend that handles user registration, token-based session management, mathematical crop recommendation models, and audit logs.
3.  **Dual-Mode ML Inference Engine**: A unique, highly resilient diagnostic backend. It combines a deep learning TensorFlow model (specifically trained for tomato leaf diseases) with robust visual heuristic fallback algorithms configured for **12 prominent Indian crops** (Tomato, Potato, Corn, Apple, Grape, Rice, Wheat, Cotton, Sugarcane, Mustard, Chilli, and Onion).

---

## 3. What It Does

AgroVision AI operates as a unified agricultural command center, executing four main functions:

### 🔬 I. Intelligent AI Leaf Diagnosis
*   **Targeted Diagnostics**: The user selects a crop category (out of the 12 Indian crops) and uploads or drags-and-drops an image of an infected leaf.
*   **Deep Learning & Fallback Heuristics**: The image is parsed into an in-memory base64 stream and sent to the Django API. Tomato leaves are run through a convolutional neural network (CNN) model to detect Early Blight, Late Blight, or Yellow Leaf Curl Virus. Other crops are analyzed using an RGB color histogram extractor that gauges green, necrotic (brown), and chlorotic (yellow) ratios to map severe, moderate, or mild outbreaks.
*   **Agronomic Prescriptions**: The backend returns a detailed report, which includes a circular confidence gauge, estimated yield impact, list of symptoms, causes of the outbreak, and a "Smart Medication Shelf" with precise dosages for both **Chemical Fungicides** and **Organic Bio-pesticides**.

### 🧪 II. Soil-Based Crop Advisor
*   **Macronutrient Integration**: Farmers adjust interactive sliders representing soil macronutrients: Nitrogen (N), Phosphorus (P), Potassium (K), and soil pH.
*   **GPS Weather Autofill**: By clicking the GPS button, the frontend leverages the browser's location API to fetch live meteorological statistics (temperature, humidity, and rainfall) **directly from the Open-Meteo API**.
*   **Predictive Modeling**: The crop parameters are submitted to the backend to run a Scikit-Learn **Random Forest Classifier** (or an agronomic decision-tree fallback) to predict the most profitable and high-yielding crop category suited for that specific patch of land.

### 📊 III. Historic Farmer Dashboard & Relational Audits
*   **Structured Auditing**: Every leaf diagnosis and crop recommendation is securely logged in the SQLite database, linked to the logged-in user profile.
*   **Custom React SVG Charts**: The dashboard translates tabular logs into beautiful visual analytics:
    *   *Pathogen Outbreaks (Bar Chart)*: Automatically counts and flags the top diseases active in the farmer's crops.
    *   *30-Day Crop Health Trends (Area Chart)*: Visualizes a gradient-filled timeline of healthy versus diseased uploads to track improvement over time.
    *   *Audit Trails*: Allows the farmer to inspect detailed base64 leaf previews and full historical diagnostic sheets.

### 📖 IV. Farmer's Resource Guide
*   **Seasonal Calendars**: Highlights active seasonal threats across Spring, Summer, Monsoon, and Winter.
*   **Fertilizer Calculator**: Provides recommended N-P-K ratios and application timing charts for Indian staple crops.
*   **General Hygiene Guidelines**: Details structural recommendations for crop rotation, leaf ventilation spacing, and drip irrigation to isolate spores.

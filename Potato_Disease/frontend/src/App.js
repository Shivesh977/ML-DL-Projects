import React, { useState } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Create preview URL
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setPrediction(data.class);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="overlay-card">
        <h1 className="title">🥔 Potato Disease Detection</h1>

        {/* Show uploaded image preview */}
        {preview && (
          <img src={preview} alt="Preview" className="preview-img" />
        )}

        <input type="file" onChange={handleFileChange} className="file-input" />

        <button onClick={handleSubmit} className="predict-btn">
          Predict Disease
        </button>

        {prediction && (
          <div className="result">
            <h2>Prediction:</h2>
            <p>{prediction}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

# Doing backend using fastapi

from fastapi import FastAPI ,File,UploadFile
import uvicorn
from io import BytesIO
import numpy as  np 
from PIL import Image  #used to read images in python
import tensorflow as tf  
import keras
from fastapi.middleware.cors import CORSMiddleware


MODEL=tf.keras.models.load_model(r"D:\Deep Learning\Potato_Disease\saved_models\1.keras") # to load our trained model
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

app=FastAPI() # object of fastapi class storing inside variable app....This is our api server
origins = [
    "http://localhost",
    "http://localhost:3000",
]
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping") #"Whenever someone sends an HTTP GET request to /ping, run the function below."
async def ping(): # function name is ping async : make it asynchronous
    return "Hello , I am alive " # when someone hits Get/ping function return hello i am alive 


def read_file_as_image(data): # this function takes image and converts into numpy array such that we can give to our model 
   image= np.array(Image.open(BytesIO(data))) # converts pil image into numpy array
   return image
    
    
    
    
@app.post("/predict")
async def predict(
    file: UploadFile=File(...) # file contains file which has been uploaded by user upon which we have to do prediction 
):
    image= read_file_as_image(await file.read()) # we need to convert these bytes into numpy array 
    
    img_batch=np.expand_dims(image,0) # adding 1 more dimension such that we can give in predict function as it takes multiple images at once [1,2] -> [[1,2]]
    predictions=MODEL.predict(img_batch) # predict function doesnt take single image as an input it takes multiple images 
    
    predicted_class=CLASS_NAMES[np.argmax(predictions[0])]#  np.argmax(predictions[0]) gives indx of  class with max confidence  prediction[0] give confidence of each class we have 3 class
    confidence=np.max(predictions[0])
    
    return{
        'class':predicted_class,
        'confidence':float(confidence)
    }

# running on port 8000
if __name__=="__main__": # another way to run the server 
    uvicorn.run(app,host='localhost',port=8000)
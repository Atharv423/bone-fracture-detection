from flask import Flask, render_template, request, redirect, url_for
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications import DenseNet121
from tensorflow.keras import layers, models
import tensorflow as tf
import numpy as np
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Folder for uploaded images
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Class labels
class_labels = ['Normal', 'Fracture']

# -------- Helper: Safe DenseNet loader --------
def load_safe_densenet(model_path):
    try:
        model = load_model(model_path)
        print(f"Loaded model successfully from {model_path}")
        return model
    except Exception as e:
        print(f"[Warning] Could not load model: {e}")
        print("Rebuilding DenseNet121 model architecture...")

        # Rebuild DenseNet121 architecture
        base_model = DenseNet121(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
        base_model.trainable = False

        model = models.Sequential([
            base_model,
            layers.GlobalAveragePooling2D(),
            layers.Dense(128, activation='relu'),
            layers.Dropout(0.3),
            layers.Dense(1, activation='sigmoid')
        ])
        model.load_weights(model_path)
        return model

# Load DenseNet121 model once at startup
model = load_safe_densenet('densenet.h5')


@app.route('/')
def upload_page():
    return render_template('upload.html')


@app.route('/analyze', methods=['POST'])
def analyze_image():
    if 'file-upload' not in request.files:
        return redirect(url_for('upload_page'))

    file = request.files['file-upload']
    if file.filename == '':
        return redirect(url_for('upload_page'))

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    # Preprocess image for DenseNet
    img = image.load_img(filepath, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = tf.keras.applications.densenet.preprocess_input(img_array)

    # Prediction
    predictions = model.predict(img_array)
    confidence = float(np.max(predictions))
    predicted_class = class_labels[int(predictions[0][0] > 0.5)]

    return render_template(
        'result.html',
        result=predicted_class,
        confidence=round(confidence * 100, 2),
        filename=filename
    )


if __name__ == '__main__':
    app.run(debug=False)

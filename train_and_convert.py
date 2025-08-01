# Full working version of the script with corrected paths
import pandas as pd
import numpy as np
import tensorflow as tf
import json
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense
from tensorflow.keras.utils import to_categorical
import os

# --- Path Fix ---
BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, "goemotions", "data")

# Load emotions.txt
with open(os.path.join(DATA_PATH, "emotions.txt"), "r", encoding="utf-8") as f:
    emotion_labels = [line.strip() for line in f.readlines()]
num_classes = len(emotion_labels)

# Load data function
def load_data(filename):
    filepath = os.path.join(DATA_PATH, filename)
    sentences, labels = [], []
    with open(filepath, encoding="utf-8") as f:
        lines = f.readlines()[1:]
        for line in lines:
            parts = line.strip().split("\t")
            if len(parts) == 2:
                text, label = parts
                sentences.append(text)
                labels.append(int(label))
    return sentences, labels

# Load training data
texts, labels = load_data("train.tsv")

# Label encoding
labels = np.array(labels)
labels_encoded = to_categorical(labels, num_classes=num_classes)

# Tokenization
tokenizer = Tokenizer(num_words=5000, oov_token="<OOV>")
tokenizer.fit_on_texts(texts)
sequences = tokenizer.texts_to_sequences(texts)
padded_sequences = pad_sequences(sequences, padding='post', maxlen=50)

# Save tokenizer
with open(os.path.join(BASE_DIR, "tokenizer.json"), "w", encoding="utf-8") as f:
    json.dump(tokenizer.to_json(), f)

# Build model
model = Sequential([
    Embedding(5000, 64, input_length=50),
    LSTM(64),
    Dense(num_classes, activation='softmax')
])

model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

# Train model
model.fit(padded_sequences, labels_encoded, epochs=10, batch_size=32, validation_split=0.1)

# Save model
model.save(os.path.join(BASE_DIR, "model.h5"))

# Convert to TensorFlow.js
os.system(f"tensorflowjs_converter --input_format keras model.h5 ../frontend/public/model/")
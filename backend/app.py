from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
from googletrans import Translator  # Using googletrans for translation

app = Flask(__name__)
CORS(app)

# Initialize Whisper model for transcription
model = whisper.load_model("base")

# Initialize Translator
translator = Translator()

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio = request.files["audio"]
    audio_path = "temp.wav"
    audio.save(audio_path)

    try:
        result = model.transcribe(audio_path)
        return jsonify({"transcription": result["text"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        os.remove(audio_path)

@app.route('/translate', methods=['POST'])
def translate():
    data = request.get_json()
    text = data.get('text', '')
    target_lang = data.get('target_lang', 'en')

    if not text:
        return jsonify({"error": "No text provided for translation"}), 400

    try:
        # Translate text using googletrans
        translated = translator.translate(text, dest=target_lang)
        return jsonify({"translatedText": translated.text})
        return jsonify("translatedText")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)

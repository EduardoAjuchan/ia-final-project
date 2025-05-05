import google.generativeai as genai
import base64
from io import BytesIO
from PIL import Image
import os
from dotenv import load_dotenv
import json
import re

# Cargar variables de entorno
load_dotenv()

# Configurar la API key desde variable de entorno
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Inicializar el modelo de visión
model = genai.GenerativeModel(model_name='gemini-1.5-pro')

def analyze_crop_image(image_file):
    # Leer los bytes de la imagen
    image_bytes = image_file.file.read()
    image_base64 = base64.b64encode(image_bytes).decode('utf-8')

    # Crear el contenido multimedia compatible con Gemini
    image_part = {
        "inline_data": {
            "mime_type": "image/jpeg",
            "data": image_base64
        }
    }

    # Prompt detallado para la API de Gemini
    prompt = (
        "Analiza esta imagen de una fruta, verdura o legumbre. Devuelve un JSON con los siguientes campos exactos: "
        "nivel_maduracion, enfermedades, necesidades_nutricionales, tipo_cosecha, fecha_tentativa_cosecha, tiempo_siembra. "
        "'tipo_cosecha' debe ser solo el nombre del fruto, por ejemplo: 'tomate', 'zanahoria', etc. "
        "'necesidades_nutricionales' debe ser una lista separada por comas con lo que necesita el fruto para desarrollarse (por ejemplo: potasio, hierro, agua), sin explicaciones. "
        "'fecha_tentativa_cosecha' debe estimar en días o semanas cuánto tiempo hace que fue cosechado. "
        "'tiempo_siembra' debe estimar en días o semanas cuánto tiempo pasó desde que fue sembrado, basado en el estado actual del fruto. "
        "Si la imagen no corresponde a una fruta, verdura o legumbre, devuelve un JSON donde todos los campos digan 'no aplica'. "
        "Responde exclusivamente con un JSON válido. No incluyas explicaciones ni texto adicional."
    )

    response = model.generate_content(
        contents=[
            {"role": "user", "parts": [prompt, image_part]}
        ]
    )

    try:
        match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if not match:
            raise ValueError("No se encontró un bloque JSON en la respuesta de Gemini.")
        json_text = match.group(0)
        parsed_json = json.loads(json_text)
        return parsed_json
    except json.JSONDecodeError:
        raise ValueError("La respuesta de Gemini no es un JSON válido.")
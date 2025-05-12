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
model = genai.GenerativeModel(model_name='gemini-2.0-flash')


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

    prompt = (
        """Analiza esta imagen que puede contener una fruta, verdura, legumbre o una planta en estado de siembra (como un pilón). 
Devuelve exclusivamente un JSON con los siguientes campos estructurados. No incluyas texto adicional ni explicaciones:

{
  "diagnostico": {
    "tipo_cultivo": "Nombre del cultivo (ej. papa, tomate, maíz)",
    "estado_actual": "Etapa fenológica (siembra, vegetativo, floración, maduración, cosecha)",
    "nivel_maduracion": "Descripción clara (ej. en formación de tubérculo, lista para cosechar)",
    "tiempo_desde_siembra": "Tiempo estimado desde siembra (en días o semanas)",
    "tiempo_estimado_para_cosecha": "Tiempo restante estimado hasta cosecha (en días o semanas)",
    "periodo_cosecha": "Indicar si es 'única' (una sola vez al final del ciclo) o 'periódica' (recolección continua por semanas o meses)",
    "frecuencia_cosecha": "Frecuencia estimada de cosecha si es periódica. Ejemplo: 'cada semana', 'dos veces por semana', 'cada 15 días'. Si es una sola cosecha, devolver 'una sola vez al final del ciclo'.",
    "enfermedades_detectadas": "Lista de enfermedades visibles o 'ninguna visible'"
  },
  "recomendaciones": {
    "fertilizacion": {
      "formula_recomendada": "Ej. 15-15-15, 20-20-20",
      "producto_quimico_guatemala": [
        "Lista dinámica de fertilizantes disponibles en Guatemala que coincidan con la fórmula_recomendada. No uses esta misma lista como respuesta, genera una nueva basada en el análisis del tipo de cultivo y fórmula."
      ],
      "dosis": "Cantidad recomendada en kilogramos por metro cuadrado (kg/m²), no en hectáreas ni manzanas. Asegúrate de que la dosis sea coherente con lo que se usaría en campo para el tipo de cultivo. Por ejemplo, si normalmente se aplican 500 kg/ha, devuelve 0.05 kg/m².",
      "frecuencia": "Cada cuántos días o semanas aplicar",
      "etapa_aplicacion": "En qué etapa aplicarla (ej. floración)"
    },
    "riego": {
      "cantidad_aproximada": "Cantidad estimada en litros por metro cuadrado (L/m²) o litros por metro cúbico (L/m³), según el tipo de cultivo y sistema de riego. Para cultivos en campo abierto, usa L/m². Ejemplo: '5 L/m² por aplicación'",
      "frecuencia": "Frecuencia recomendada (ej. 2 veces por semana)",
      "recomendacion": "Consejo breve (ej. evitar encharcamientos)"
    },
    "control_fitosanitario": {
      "plagas_comunes": ["plaga1", "plaga2"],
      "enfermedades_detectadas": ["enfermedad1", "enfermedad2"],
      "recomendaciones_preventivas": "Lista de productos genéricos o comerciales (fungicidas o insecticidas) que se recomienda aplicar de forma preventiva según el tipo de cultivo, la etapa fenológica y las condiciones climáticas. Si no aplica, devolver 'no se recomienda ningún producto preventivo por ahora'.",
      "recomendaciones_curativas": "Lista de productos genéricos o comerciales (fungicidas o insecticidas) que se recomienda aplicar si se detectaron plagas o enfermedades. Si no se detectan problemas visibles, devolver 'no se recomienda ningún producto curativo por ahora'."
    }
  },
  "calendario": {
    "fechas_recomendadas": {
      "aporque": "Semana sugerida",
      "fertilizacion": "Semanas o fechas estimadas",
      "riego": "Frecuencia de riego sugerida",
      "cosecha": "Semana estimada de cosecha"
    },
    "alertas": ["Texto breve con recomendaciones críticas"]
  },
  "informe": {
    "resumen": "Diagnóstico general del cultivo",
    "recomendacion_general": "Resumen de acciones sugeridas"
  }
}

Si la imagen no corresponde a una fruta, verdura, legumbre o planta sembrada, devuelve un JSON donde todos los campos contengan el texto: 'no aplica'.

Toma en cuenta las siguientes consideraciones:
Ambos campos deben ser coherentes con los tiempos típicos de desarrollo de ese tipo de cultivo.
Por ejemplo, si un rábano tarda típicamente de 4 a 5 semanas en desarrollarse, no indiques 10 semanas desde su siembra.
"""
    )

    response = model.generate_content(
        contents=[
            {"role": "user", "parts": [prompt, image_part]}
        ]
    )

    try:
        match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if not match:
            raise ValueError(
                "No se encontró un bloque JSON en la respuesta de Gemini.")
        json_text = match.group(0)
        parsed_json = json.loads(json_text)
        return parsed_json
    except json.JSONDecodeError:
        raise ValueError("La respuesta de Gemini no es un JSON válido.")

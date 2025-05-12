from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from utils.gemini_client import analyze_crop_image

app = FastAPI()

# Habilitar CORS para el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Puedes restringir esto por seguridad
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "API de análisis de imágenes con Gemini activa"}


@app.post("/analizar-imagen")
async def analizar_imagen(file: UploadFile = File(...)):
    try:
        resultado_json = analyze_crop_image(file)
        return JSONResponse(content=resultado_json)
    except ValueError as ve:
        print("Error de validación:", ve)
        return JSONResponse(content={"error": str(ve)}, status_code=400)
    except Exception as e:
        print("Error interno:", e)
        return JSONResponse(content={"error": "Error interno del servidor"}, status_code=500)

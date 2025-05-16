'use client';

import { useState } from 'react';
import StartScreen from '@/components/StartScreen';
import CameraView from '@/components/CameraView';
import FotoPreview from '@/components/FotoPreview';
import SkeletonResultado from '@/components/SkeletonResultado';
import axios from 'axios';

export default function HomePage() {
  const [foto, setFoto] = useState<string | null>(null);
  const [mostrarCamara, setMostrarCamara] = useState(false);
  const [resultado, setResultado] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setMostrarCamara(true);
  };

  const handleCapture = (fotoBase64: string) => {
    setFoto(fotoBase64);
    setMostrarCamara(false);
  };

  const base64ToBlob = (base64Data: string): Blob => {
    const byteString = atob(base64Data.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([intArray], { type: 'image/jpeg' });
  };

  const handleEnviar = async () => {
    setResultado(null); // Resetear resultado anterior
    if (!foto) return;

    const blob = base64ToBlob(foto);
    const formData = new FormData();
    formData.append('file', blob, 'captura.jpg');

    try {
      setIsLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResultado(res.data);
    } catch (error) {
      console.error("Error al enviar imagen:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReintentar = () => {
    setFoto(null);
    setResultado(null);
    setMostrarCamara(true);
  };

  return (
    <>
      {!mostrarCamara && !foto && <StartScreen onStart={handleStart} />}
      {mostrarCamara && <CameraView onCapture={handleCapture} />}
      {foto && !resultado && !isLoading && (
        <FotoPreview
          foto={foto}
          onEnviar={handleEnviar}
          onReintentar={handleReintentar}
        />
      )}
      {foto && isLoading && <SkeletonResultado />}
      {foto && resultado && (
        <div className="max-w-sm mx-auto mt-6 transition-opacity duration-700 ease-in opacity-100">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden fade-in">
            <div className="relative">
              <img src={foto} alt="Resultado" className="w-full h-auto object-cover" />
              <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent" />
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {resultado.diagnostico?.tipo_cultivo ?? 'Cultivo desconocido'}{' '}
                  <span className="inline-block ml-1 text-green-600">✔️</span>
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {resultado.diagnostico?.nivel_maduracion ?? ''} ·{' '}
                  {resultado.diagnostico?.estado_actual ?? ''}
                </p>
                <p className="text-gray-700 text-sm mt-3 animate-typing">
                  {resultado.informe?.resumen}
                </p>
              </div>

              {/* Diagnóstico */}
              <div>
                <h3 className="text-md font-semibold text-green-600">🩺 Diagnóstico completo</h3>
                {Object.entries(resultado.diagnostico).map(([key, value]) => (
                  <p key={key} className="text-sm text-gray-700">
                    <strong>{key.replace(/_/g, ' ')}:</strong> {String(value)}
                  </p>
                ))}
              </div>

              {/* Fertilización */}
              <div>
                <h3 className="text-md font-semibold text-green-600">🌾 Fertilización</h3>
                {Object.entries(resultado.recomendaciones?.fertilizacion || {}).map(([key, value]) => (
                  <p key={key} className="text-sm text-gray-700">
                    <strong>{key.replace(/_/g, ' ')}:</strong>{' '}
                    {Array.isArray(value) ? value.join(', ') : String(value)}
                  </p>
                ))}
              </div>

              {/* Riego */}
              <div>
                <h3 className="text-md font-semibold text-green-600">💧 Riego</h3>
                {Object.entries(resultado.recomendaciones?.riego || {}).map(([key, value]) => (
                  <p key={key} className="text-sm text-gray-700">
                    <strong>{key.replace(/_/g, ' ')}:</strong> {String(value)}
                  </p>
                ))}
              </div>

              {/* Control fitosanitario */}
              <div>
                <h3 className="text-md font-semibold text-green-600">🛡️ Control fitosanitario</h3>
                {Object.entries(resultado.recomendaciones?.control_fitosanitario || {}).map(([key, value]) => (
                  <p key={key} className="text-sm text-gray-700">
                    <strong>{key.replace(/_/g, ' ')}:</strong>{' '}
                    {Array.isArray(value) ? value.join(', ') : String(value)}
                  </p>
                ))}
              </div>

              {/* Calendario */}
              <div>
                <h3 className="text-md font-semibold text-green-600">📆 Calendario</h3>
                {Object.entries(resultado.calendario?.fechas_recomendadas || {}).map(([key, value]) => (
                  <p key={key} className="text-sm text-gray-700">
                    <strong>{key.replace(/_/g, ' ')}:</strong> {String(value)}
                  </p>
                ))}
                {resultado.calendario?.alertas && (
                  <p className="text-sm text-gray-700">
                    <strong>Alertas:</strong> {resultado.calendario.alertas.join(', ')}
                  </p>
                )}
              </div>

              {/* Informe */}
              <div>
                <h3 className="text-md font-semibold text-green-600">📝 Informe</h3>
                <p className="text-sm text-gray-700">
                  <strong>Resumen:</strong> {String(resultado.informe?.resumen)}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Recomendación general:</strong> {String(resultado.informe?.recomendacion_general)}
                </p>
              </div>

              <button
                onClick={handleReintentar}
                className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
              >
                Analizar otra planta
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

      {/* CSS Animación de escritura */}
      <style jsx>{`
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }

        .animate-typing {
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid #4ade80;
          width: fit-content;
          animation: typing 2s steps(40, end);
        }

        .fade-in {
          opacity: 0;
          animation: fadeInCard 0.8s ease-in forwards;
        }
        @keyframes fadeInCard {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
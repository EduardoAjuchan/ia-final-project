'use client';

import { useRef, useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';

export default function CameraView({ onCapture }: { onCapture: (foto: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Solo para mostrar el botón si el usuario cancela
  const [cancelado, setCancelado] = useState(false);

  useEffect(() => {
    // Eliminar el auto-disparo del input en móviles
    if (!isMobile) {
      const iniciarCamara = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      };
      iniciarCamara();
    }
  }, [isMobile]);

  // Unificar la captura de foto en móvil y PC
  const tomarFoto = () => {
    if (isMobile) {
      inputFileRef.current?.click();
      return;
    }
    // PC: capturar desde la cámara
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
  };

  const handleArchivoMovil = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setCancelado(true);
      return;
    }
    setCancelado(false);
    e.target.value = '';
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onCapture(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box className="flex flex-col items-center mt-4 px-4">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleArchivoMovil}
        style={{ display: 'none' }}
        ref={inputFileRef}
      />
      <Button
        onClick={tomarFoto}
        variant="contained"
        sx={{
          mt: 4,
          px: { xs: 4, sm: 6 },
          py: { xs: 1.5, sm: 2 },
          borderRadius: '9999px',
          fontWeight: 'bold',
          textTransform: 'none',
          backgroundColor: '#22c55e',
          color: '#fff',
          boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
          gap: 1.5,
          '&:hover': {
            backgroundColor: '#16a34a',
            boxShadow: '0 6px 16px rgba(22, 163, 74, 0.5)',
          },
          '&:active': {
            transform: 'scale(0.97)',
          },
        }}
      >
        Capturar imagen
      </Button>
      {/* Solo mostrar el video y canvas en PC */}
      {!isMobile && (
        <>
          <video ref={videoRef} className="rounded-md shadow w-full max-w-md" />
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
      {/* Si el usuario cancela en móvil, mostrar el mensaje y botón */}
      {isMobile && cancelado && (
        <Box className="flex flex-col items-center justify-center min-h-[200px]">
          <p className="mb-4 text-gray-700 text-center">
            No se seleccionó ninguna foto.<br />
            Por favor, selecciona o toma una foto para continuar.
          </p>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => { setCancelado(false); inputFileRef.current?.click(); }}
          >
            Elegir o tomar foto
          </Button>
        </Box>
      )}
    </Box>
  );
}
'use client';

import { Box, Button, Typography } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <Box className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white">
      <Typography
        variant="h2"
        component="h1"
        sx={{
          fontWeight: 800,
          color: '#43a047',
          fontSize: { xs: '2.5rem', sm: '3rem' },
        }}
      >
        PlantScann <span role="img" aria-label="plant">🌿</span>
      </Typography>

      <Typography
        variant="h6"
        sx={{
          mt: 2,
          fontWeight: 500,
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          color: '#43a047',
        }}
      >
        ¿Deseas tomar una imagen para analizar tu planta?
      </Typography>

      <Button
        onClick={onStart}
        variant="contained"
        startIcon={<PhotoCamera />}
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
        Tomar fotografía
      </Button>
    </Box>
  );
}
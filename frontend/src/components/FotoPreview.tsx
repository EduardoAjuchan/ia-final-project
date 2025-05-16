

'use client';

import { Box, Button, Card, CardMedia } from '@mui/material';

interface FotoPreviewProps {
  foto: string;
  onEnviar: () => void;
  onReintentar: () => void;
}

export default function FotoPreview({ foto, onEnviar, onReintentar }: FotoPreviewProps) {
  return (
    <Box className="flex flex-col items-center mt-4 px-4">
      <Card className="w-full max-w-md">
        <CardMedia component="img" image={foto} alt="Foto tomada" />
      </Card>

      <Box className="flex flex-col gap-2 mt-4 w-full max-w-md">
        <Button
          onClick={onEnviar}
          variant="contained"
          fullWidth
          sx={{
            px: { xs: 4, sm: 6 },
            py: { xs: 1.5, sm: 2 },
            borderRadius: '9999px',
            fontWeight: 'bold',
            textTransform: 'none',
            backgroundColor: '#22c55e',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
            '&:hover': {
              backgroundColor: '#16a34a',
              boxShadow: '0 6px 16px rgba(22, 163, 74, 0.5)',
            },
            '&:active': {
              transform: 'scale(0.97)',
            },
          }}
        >
          Enviar para análisis
        </Button>

        <Button
          onClick={onReintentar}
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{
            px: { xs: 4, sm: 6 },
            py: { xs: 1.5, sm: 2 },
            borderRadius: '9999px',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:active': {
              transform: 'scale(0.97)',
            },
          }}
        >
          Volver a tomar foto
        </Button>
      </Box>
    </Box>
  );
}
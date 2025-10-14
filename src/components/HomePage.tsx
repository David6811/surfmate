import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Container
} from '@mui/material';

export const HomePage: React.FC = () => {

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #155e75 0%, #0891b2 25%, #0284c7 50%, #0ea5e9 75%, #38bdf8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Ocean Wave Texture */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 30px,
          rgba(255,255,255,0.08) 30px,
          rgba(255,255,255,0.08) 32px
        ),
        repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 25px,
          rgba(255,255,255,0.06) 25px,
          rgba(255,255,255,0.06) 27px
        )`,
        animation: 'waveTexture 20s linear infinite'
      }} />

      {/* Floating Ocean Bubbles */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle 80px at 25% 20%, rgba(255,255,255,0.25) 0%, transparent 50%),
           radial-gradient(circle 60px at 75% 35%, rgba(255,255,255,0.2) 0%, transparent 50%),
           radial-gradient(circle 100px at 45% 70%, rgba(255,255,255,0.18) 0%, transparent 50%),
           radial-gradient(circle 70px at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 50%),
           radial-gradient(circle 90px at 15% 65%, rgba(255,255,255,0.12) 0%, transparent 50%)`,
        animation: 'foamFloat 40s ease-in-out infinite'
      }} />

      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6, md: 8 },
            borderRadius: '180px 180px 180px 180px / 290px 290px 100px 100px',
            background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 20%, #e2e8f0 50%, #cbd5e1 80%, #94a3b8 100%)',
            backdropFilter: 'blur(10px)',
            border: '2px solid #64748b',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)',
            position: 'relative',
            zIndex: 1,
            transform: 'perspective(800px) rotateX(5deg)',
            textAlign: 'center'
          }}
        >
          {/* SurfMate Logo */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: { xs: 4, sm: 5, md: 6 }
          }}>
            <Box
              component="img"
              src={`${process.env.PUBLIC_URL || ''}/icons/icon128.png`}
              alt="SurfMate Logo"
              sx={{
                width: { xs: '80px', sm: '100px', md: '120px' },
                height: { xs: '80px', sm: '100px', md: '120px' },
                borderRadius: { xs: '16px', sm: '20px', md: '24px' },
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease-in-out',
                cursor: 'pointer',
                filter: 'contrast(1.2) brightness(0.9)',
                backgroundColor: 'transparent',
                '&:hover': {
                  transform: 'scale(1.1) rotate(3deg)',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
                }
              }}
            />
          </Box>
          
          <Typography variant="h2" gutterBottom sx={{ 
            fontWeight: 900, 
            mb: { xs: 2, sm: 3, md: 3 },
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '1px'
          }}>
            SurfMate
          </Typography>
          
          <Typography variant="h5" sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.8rem' },
            color: '#475569',
            mb: { xs: 3, sm: 4, md: 5 },
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            Coming Soon
          </Typography>
          
          <Typography variant="body1" sx={{ 
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
            lineHeight: { xs: 1.5, sm: 1.6, md: 1.7 },
            color: '#64748b',
            maxWidth: { xs: 320, sm: 400, md: 450 },
            mx: 'auto',
            mb: { xs: 4, sm: 5, md: 6 },
            textAlign: 'center',
            fontWeight: 500
          }}>
            🌊 We're working hard to bring you the ultimate web browsing companion. Stay tuned!
          </Typography>
        </Paper>
      </Container>

      <style>
        {`
          @keyframes waveTexture {
            0% { transform: translateX(0) translateY(0); }
            100% { transform: translateX(50px) translateY(-50px); }
          }
          @keyframes foamFloat {
            0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
            50% { transform: scale(1.1) rotate(1deg); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};
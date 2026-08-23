import { motion } from 'motion/react';

export function BackgroundShapes() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      {/* Large sphere top right */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-8rem',
          right: '-8rem',
          width: '24rem',
          height: '24rem',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #FFDAC1 0%, #FFB088 40%, #FF8C61 100%)',
          boxShadow: 'inset -20px -20px 40px rgba(255, 140, 97, 0.4), 0 20px 60px rgba(255, 140, 97, 0.3)',
          opacity: 0.6,
        }}
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Medium sphere left */}
      <motion.div
        style={{
          position: 'absolute',
          top: '25%',
          left: '-6rem',
          width: '16rem',
          height: '16rem',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%, #FFE4D0 0%, #FFDAC1 50%, #FFB088 100%)',
          boxShadow: 'inset -15px -15px 30px rgba(255, 176, 136, 0.4), 0 15px 45px rgba(255, 176, 136, 0.25)',
          opacity: 0.5,
        }}
        animate={{ y: [0, 40, 0], x: [0, -15, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Organic blob bottom center */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '33%',
          width: '20rem',
          height: '20rem',
          background: 'radial-gradient(ellipse at 30% 30%, #FFBEA3 0%, #FF9B6A 50%, #FF7043 100%)',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          boxShadow: 'inset -18px -18px 35px rgba(255, 112, 67, 0.4), 0 18px 50px rgba(255, 112, 67, 0.3)',
          opacity: 0.55,
        }}
        animate={{ y: [0, -25, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Small sphere top left */}
      <motion.div
        style={{
          position: 'absolute',
          top: '5rem',
          left: '25%',
          width: '10rem',
          height: '10rem',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #FFEAD8 0%, #FFD4BA 50%, #FFA87D 100%)',
          boxShadow: 'inset -10px -10px 20px rgba(255, 168, 125, 0.3), 0 10px 30px rgba(255, 168, 125, 0.2)',
          opacity: 0.45,
        }}
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Organic shape right center */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          right: '25%',
          width: '18rem',
          height: '18rem',
          background: 'radial-gradient(ellipse at 25% 25%, #FFD7C1 0%, #FFBEA3 45%, #FF8961 100%)',
          borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
          boxShadow: 'inset -16px -16px 32px rgba(255, 137, 97, 0.4), 0 16px 48px rgba(255, 137, 97, 0.28)',
          opacity: 0.5,
        }}
        animate={{ y: [0, 35, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Small organic blob bottom right */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '5rem',
          right: '8%',
          width: '12rem',
          height: '12rem',
          background: 'radial-gradient(ellipse at 35% 35%, #FFDEC8 0%, #FFC5A8 50%, #FF9670 100%)',
          borderRadius: '70% 30% 50% 50% / 60% 40% 60% 40%',
          boxShadow: 'inset -12px -12px 24px rgba(255, 150, 112, 0.35), 0 12px 36px rgba(255, 150, 112, 0.22)',
          opacity: 0.48,
        }}
        animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Medium sphere bottom left */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '25%',
          left: '5rem',
          width: '14rem',
          height: '14rem',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 32% 32%, #FFE7D5 0%, #FFDBC4 48%, #FFB187 100%)',
          boxShadow: 'inset -14px -14px 28px rgba(255, 177, 135, 0.38), 0 14px 42px rgba(255, 177, 135, 0.24)',
          opacity: 0.52,
        }}
        animate={{ y: [0, 28, 0], x: [0, -12, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
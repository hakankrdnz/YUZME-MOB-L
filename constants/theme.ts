export const Colors = {
  background: '#070C16',      // Deepest midnight navy
  surface: '#0F172A',         // Primary card background
  surfaceLight: '#1E293B',    // Highlighted card / elevated element
  surfaceGlass: 'rgba(15, 23, 42, 0.75)', // Glassmorphic card surface

  primary: '#FACC15',         // Electric Gold / Amber Yellow
  primaryDark: '#EAB308',
  primaryLight: '#38BDF8',    // Cyan Light
  primaryGlow: 'rgba(250, 204, 21, 0.25)',


  secondary: '#38BDF8',       // Open Water Cyan Blue
  secondaryDark: '#0284C7',
  secondaryGlow: 'rgba(56, 189, 248, 0.25)',

  accent: '#F97316',          // Warm Orange (Intervals & Focus)
  green: '#22C55E',           // Speed Green & Completed Status
  success: '#10B981',         // Emerald Green
  warning: '#F59E0B',         // Warm Amber
  purple: '#A855F7',          // Recovery / Hypoxic Purple
  red: '#EF4444',             // Pure Speed & Alert Red

  textPrimary: '#F8FAFC',     // Crisp Pure White
  textSecondary: '#94A3B8',   // Muted Slate Text
  textMuted: '#64748B',       // Subtitle Grey Text

  border: '#1E293B',          // Card border
  borderGlass: 'rgba(255, 255, 255, 0.08)', // Subtle glass highlight border

  yellowBadge: '#FEF08A',
  yellowBadgeText: '#854D0E',
  cyanBadge: '#E0F2FE',
  cyanBadgeText: '#0369A1',
};

export const Layout = {
  borderRadius: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
    full: 999
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    glowYellow: {
      shadowColor: '#FACC15',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 6,
    },
    glowCyan: {
      shadowColor: '#38BDF8',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 6,
    }
  }
};


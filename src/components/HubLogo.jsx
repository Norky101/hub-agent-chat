import theme from '../theme.js'

// Hub Agent logo — a central node with three connection paths radiating out,
// representing the webhook hub connecting multiple providers.
// At small sizes (20px) reads as a compact geometric mark.
// At larger sizes (48px) the connection lines and nodes are visible.

export default function HubLogo({ size = 24, animate = false, style = {} }) {
  const accent = theme.colors.accent
  const lighter = 'rgba(79, 110, 247, 0.5)'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      style={{
        display: 'block',
        ...(animate ? { animation: 'logoPulse 1.8s ease-in-out infinite' } : {}),
        ...style,
      }}
    >
      {/* Connection lines from center to outer nodes */}
      <line x1="16" y1="16" x2="7" y2="7" stroke={lighter} strokeWidth={1.5} strokeLinecap="round" />
      <line x1="16" y1="16" x2="26" y2="9" stroke={lighter} strokeWidth={1.5} strokeLinecap="round" />
      <line x1="16" y1="16" x2="16" y2="27" stroke={lighter} strokeWidth={1.5} strokeLinecap="round" />

      {/* Outer nodes (providers) */}
      <circle cx="7" cy="7" r="2.5" fill={accent} opacity={0.7} />
      <circle cx="26" cy="9" r="2.5" fill={accent} opacity={0.7} />
      <circle cx="16" cy="27" r="2.5" fill={accent} opacity={0.7} />

      {/* Central hub node — larger, solid */}
      <circle cx="16" cy="16" r="5" fill={accent} />

      {/* Inner hub detail — small bright core */}
      <circle cx="16" cy="16" r="2" fill="white" opacity={0.9} />
    </svg>
  )
}

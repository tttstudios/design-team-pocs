import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { ShieldCheck } from '@phosphor-icons/react'

const portals = [
  {
    key: 'admin',
    title: 'Admin Portal',
    description: 'Manage clients, configure assessments, review submissions and oversee the entire platform.',
    icon: <ShieldCheck size={40} weight="duotone" />,
    solarIcon: 'solar:shield-user-bold-duotone',
    accent: '#0EA5E9',
    accentLight: '#E0F2FE',
    path: '/admin',
    badge: 'Admin',
  },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <Icon icon="solar:buildings-bold-duotone" style={{ fontSize: 28, color: '#4F46E5' }} />
          <span style={styles.logoText}>H4U Prototypes</span>
        </div>
      </header>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.pill}>
          <Icon icon="solar:star-bold-duotone" style={{ fontSize: 14, color: '#4F46E5' }} />
          <span>Portal Prototype v1.0</span>
        </div>
        <h1 style={styles.heroTitle}>Welcome to <span style={styles.gradientText}>H4U Prototypes</span></h1>
        <p style={styles.heroSub}>
          Choose your portal to get started. Each section is tailored to your role and responsibilities.
        </p>
      </div>

      {/* Cards */}
      <div style={styles.grid}>
        {portals.map((portal) => (
          <button
            key={portal.key}
            style={{ ...styles.card, '--accent': portal.accent, '--accent-light': portal.accentLight }}
            onClick={() => navigate(portal.path)}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px)'
              e.currentTarget.style.boxShadow = `0 20px 40px ${portal.accent}28`
              e.currentTarget.style.borderColor = portal.accent
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)'
              e.currentTarget.style.borderColor = '#E5E7EB'
            }}
          >
            <div style={{ ...styles.iconWrap, background: portal.accentLight, color: portal.accent }}>
              <Icon icon={portal.solarIcon} style={{ fontSize: 42 }} />
            </div>
            <div style={{ ...styles.badge, background: portal.accentLight, color: portal.accent }}>
              {portal.badge}
            </div>
            <h2 style={styles.cardTitle}>{portal.title}</h2>
            <p style={styles.cardDesc}>{portal.description}</p>
            <div style={{ ...styles.cta, color: portal.accent }}>
              Enter Portal
              <Icon icon="solar:arrow-right-bold" style={{ fontSize: 16 }} />
            </div>
          </button>
        ))}
      </div>

      <footer style={styles.footer}>
        <span>© 2026 H4U Prototypes. Prototype — not for production use.</span>
      </footer>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    background: '#F9F4EE',
    backgroundImage: 'url(/bg-landing.svg)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom center',
    backgroundSize: '100% auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 24px 48px',
    fontFamily: "'Lato', sans-serif",
    boxSizing: 'border-box',
  },
  header: {
    width: '100%',
    maxWidth: 1100,
    display: 'flex',
    alignItems: 'center',
    padding: '24px 0 0',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 700,
    color: '#111827',
    letterSpacing: '-0.3px',
  },
  hero: {
    textAlign: 'center',
    marginTop: 64,
    marginBottom: 56,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: '#EEF2FF',
    color: '#4F46E5',
    borderRadius: 100,
    padding: '6px 14px',
    fontSize: 13,
    fontWeight: 500,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 800,
    color: '#111827',
    margin: 0,
    letterSpacing: '-1px',
    lineHeight: 1.15,
  },
  gradientText: {
    background: 'linear-gradient(90deg, #4F46E5, #0EA5E9)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSub: {
    fontSize: 17,
    color: '#6B7280',
    maxWidth: 480,
    lineHeight: 1.6,
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 24,
    width: '100%',
    maxWidth: 1020,
  },
  card: {
    background: '#FFFFFF',
    border: '1.5px solid #E5E7EB',
    borderRadius: 20,
    padding: '36px 32px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
    transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    textAlign: 'left',
    outline: 'none',
    position: 'relative',
  },
  iconWrap: {
    width: 68,
    height: 68,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  badge: {
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 100,
    padding: '3px 12px',
    letterSpacing: '0.3px',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#111827',
    margin: 0,
    letterSpacing: '-0.3px',
  },
  cardDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 1.65,
    margin: 0,
    flexGrow: 1,
  },
  cta: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    fontWeight: 600,
    marginTop: 8,
  },
  footer: {
    marginTop: 64,
    fontSize: 13,
    color: '#9CA3AF',
  },
}

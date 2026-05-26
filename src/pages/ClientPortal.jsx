import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { Breadcrumb, Tag } from 'antd'
import { House } from '@phosphor-icons/react'

export default function ClientPortal() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <Icon icon="solar:buildings-bold-duotone" style={{ fontSize: 26, color: '#4F46E5' }} />
          <span style={styles.logoText}>H4U Prototypes</span>
        </div>
        <Tag color="purple" style={{ borderRadius: 100, fontWeight: 600 }}>Client Portal</Tag>
      </header>

      <Breadcrumb
        style={{ width: '100%', maxWidth: 900, marginTop: 16 }}
        items={[
          {
            title: (
              <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => navigate('/')}>
                <House size={14} weight="bold" /> Home
              </span>
            ),
          },
          { title: 'Client Portal' },
        ]}
      />

      <div style={styles.content}>
        <div style={styles.comingSoon}>
          <Icon icon="solar:user-circle-bold-duotone" style={{ fontSize: 80, color: '#4F46E5', opacity: 0.8 }} />
          <h1 style={styles.title}>Client Portal</h1>
          <p style={styles.sub}>This section is under construction. The client experience will live here — dashboards, reports, progress tracking, and account management.</p>
          <button style={styles.backBtn} onClick={() => navigate('/')}>
            <Icon icon="solar:arrow-left-bold" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#F8F9FC', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 24px 48px', fontFamily: "'Lato', sans-serif" },
  header: { width: '100%', maxWidth: 900, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoText: { fontSize: 18, fontWeight: 700, color: '#111827' },
  content: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 80 },
  comingSoon: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center', maxWidth: 480 },
  title: { fontSize: 36, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.5px' },
  sub: { fontSize: 16, color: '#6B7280', lineHeight: 1.7, margin: 0 },
  backBtn: { marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
}

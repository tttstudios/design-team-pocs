import { useState } from 'react'

// ── Domain & question data ─────────────────────────────────────────────────────

const DOMAINS = [
  {
    id: 'choice', name: 'Choice and Flexibility',
    questions: [
      'Residents participate in care planning',
      'Residents choose family involvement',
      'Staff adapt routines to preferences',
    ],
  },
  {
    id: 'meals', name: 'Meals and Dining',
    questions: [
      'Residents choose what, when, and where they eat',
      'Residents participate in meal preparation',
      'Cultural, religious, and dietary needs are supported',
      'Mealtime pacing reflects resident preferences',
      'Communal dining is optional, not required',
    ],
  },
  {
    id: 'personal', name: 'Personal Hygiene',
    questions: [
      'Residents choose when and how they bathe',
      'Sensory preferences are respected',
      'Residents are supported in self-care',
      'Grooming reflects identity preferences',
    ],
  },
  {
    id: 'household', name: 'Household Hygiene',
    questions: [
      'Residents and families can assist with laundry',
      'Residents participate in household chores',
      'Residents have control over personal items',
      'Schedules reflect resident input',
    ],
  },
  {
    id: 'relations', name: 'Relationships & Connection',
    questions: [
      'Meaningful relational conversations happen regularly',
      "Staff know residents' life stories",
      'Staffing supports continuity of relationships',
      'Staff are educated on relational care',
    ],
  },
  {
    id: 'hobbies', name: 'Hobbies & Meaningful Activity',
    questions: [
      'Residents choose activities and timing',
      'Individualized activity plans are in place',
      'Both structured and spontaneous options are available',
      'Isolated residents remain engaged',
    ],
  },
  {
    id: 'community', name: 'Community Life & Belonging',
    questions: [
      'Residents choose their sleep and wake times',
      'Families are welcomed as partners',
      'Intergenerational interactions are available',
      'Spiritual and religious practice is supported',
      'Regular household discussion venues exist',
    ],
  },
  {
    id: 'dementia', name: 'Accessibility & Dementia Design',
    questions: [
      'Staff receive dementia-friendly training',
      'Spaces are sensory-appropriate',
      'Clear wayfinding signage is in place',
      'Noise levels are actively managed',
    ],
  },
  {
    id: 'physical', name: 'Physical Environment',
    questions: [
      'A small household model is in use',
      'Shared kitchen and living spaces are used',
      'Communal spaces are personalized',
      'Outdoor areas are accessible year-round',
      'Outdoor seating and shade are available',
    ],
  },
  {
    id: 'operations', name: 'Operations & Workforce',
    questions: [
      'Staffing supports flexibility in routines',
      'Roles allow staff to adapt care',
      'Teams can adjust routines in the moment',
      'Onboarding reinforces resident autonomy',
      'Staff wellness is actively supported',
    ],
  },
  {
    id: 'building', name: 'Building Design & Tech',
    questions: [
      'Building features support people living with dementia',
      'Lighting and temperature are adjustable',
      'Technology preserves resident autonomy',
      'Community business partnerships are active',
    ],
  },
  {
    id: 'measurement', name: 'Measurement & Outcomes',
    questions: [
      'Resident satisfaction is measured regularly',
      'Health outcomes are tracked',
      'Staff retention is monitored',
      'Data is shared with stakeholders',
      'Qualitative stories complement quantitative data',
    ],
  },
]

const ALL_QUESTIONS = DOMAINS.flatMap((d, di) =>
  d.questions.map((text, qi) => ({
    domainId: d.id, domainName: d.name, domainIndex: di,
    indexInDomain: qi, domainTotal: d.questions.length, text,
  }))
).map((q, i) => ({ ...q, globalIndex: i }))

const TOTAL_Q = ALL_QUESTIONS.length  // 52
const TOTAL_D = DOMAINS.length        // 12

const LIKERT = [
  { value: 5, label: 'Always' },
  { value: 4, label: 'Often' },
  { value: 3, label: 'Sometimes' },
  { value: 2, label: 'Rarely' },
  { value: 1, label: 'Never' },
]

const SEED_ASSESSMENTS = [
  { id: 'a1', home: 'Sunset Manor', neighbourhoods: ['North Wing', 'East Wing'] },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCardStats(aId, answers) {
  const a = answers[aId] || {}
  const answered = Object.keys(a).length
  const pct = TOTAL_Q > 0 ? Math.round((answered / TOTAL_Q) * 100) : 0
  const sectionsLeft = DOMAINS.filter(d =>
    ALL_QUESTIONS.filter(q => q.domainId === d.id).some(q => a[q.globalIndex] === undefined)
  ).length
  const status = answered === 0 ? 'Not Started' : 'In Progress'
  return { pct, sectionsLeft, status }
}

function findResumeIndex(aId, answers) {
  const a = answers[aId] || {}
  const idx = ALL_QUESTIONS.findIndex(q => a[q.globalIndex] === undefined)
  return idx >= 0 ? idx : 0
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#534AB7"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// ── Root ──────────────────────────────────────────────────────────────────────

export default function AssessmentReply() {
  const [assessments, setAssessments] = useState(SEED_ASSESSMENTS)
  const [answers, setAnswers]         = useState({})
  const [screen, setScreen]           = useState('dashboard')
  const [active, setActive]           = useState(null)
  const [qIdx, setQIdx]               = useState(0)

  const openAssessment = (a) => {
    setActive(a)
    setQIdx(findResumeIndex(a.id, answers))
    setScreen('question')
  }

  const saveAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [active.id]: { ...(prev[active.id] || {}), [qIdx]: value },
    }))
  }

  const advance = () => {
    if (qIdx >= TOTAL_Q - 1) setScreen('thankyou')
    else setQIdx(i => i + 1)
  }

  const handleFinish = () => {
    setAssessments(prev => prev.filter(a => a.id !== active.id))
    setScreen('dashboard')
  }

  const q = ALL_QUESTIONS[qIdx]
  const currentAnswer = active ? (answers[active.id] || {})[qIdx] : undefined

  return (
    <Page>
      {screen === 'dashboard' && (
        <DashboardScreen assessments={assessments} answers={answers} onOpen={openAssessment} />
      )}
      {screen === 'question' && active && q && (
        <QuestionScreen
          assessment={active} q={q} selected={currentAnswer}
          onSelect={saveAnswer} onNext={advance} onSkip={advance}
          onBack={() => setScreen('dashboard')}
        />
      )}
      {screen === 'thankyou' && active && (
        <ThankYouScreen assessment={active} onBack={handleFinish} />
      )}
    </Page>
  )
}

// ── Page / phone frame ────────────────────────────────────────────────────────

function Page({ children }) {
  return (
    <div style={{
      height: '100vh',
      background: '#f2f2f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 16px',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
      boxSizing: 'border-box',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 390,
        background: '#fff',
        borderRadius: 28,
        border: '0.5px solid #ddd',
        height: '100%',
        maxHeight: 780,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  )
}

// ── Dashboard screen ──────────────────────────────────────────────────────────

function DashboardScreen({ assessments, answers, onOpen }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '28px 20px 18px', borderBottom: '0.5px solid #f0f0f0' }}>
        <img src="/logo.svg" alt="Home for Us" style={{ height: 24, marginBottom: 18 }} />
        <div style={{ fontSize: 20, fontWeight: 700, color: '#111', letterSpacing: '-0.3px' }}>
          Your assessments
        </div>
      </div>

      <div style={{ flex: 1, padding: '14px 14px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {assessments.length === 0
          ? <EmptyState />
          : assessments.map(a => (
              <AssessmentCard key={a.id} assessment={a} stats={getCardStats(a.id, answers)} onOpen={() => onOpen(a)} />
            ))
        }
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '60px 28px', gap: 10,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: '#f5f5f5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 8,
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#bbb"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: '#111' }}>
        You're all caught up
      </div>
      <div style={{ fontSize: 14, color: '#888', lineHeight: 1.65, maxWidth: 260 }}>
        There's nothing waiting for you right now. Your home leader will let you know when a new assessment is ready.
      </div>
    </div>
  )
}

function AssessmentCard({ assessment, stats, onOpen }) {
  const { pct, sectionsLeft, status } = stats
  const badge = status === 'Not Started'
    ? { bg: '#f5f5f5', color: '#595959', dot: '#bfbfbf' }
    : { bg: '#fff7e6', color: '#d46b08', dot: '#faad14' }

  return (
    <button onClick={onOpen} style={{
      display: 'flex', flexDirection: 'column', width: '100%',
      background: '#fff', border: '0.5px solid #e0e0e0',
      borderRadius: 12, padding: '14px 16px',
      cursor: 'pointer', textAlign: 'left',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>
            {assessment.home}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0,
            background: badge.bg, color: badge.color,
            border: `0.5px solid ${badge.color}55`,
            borderRadius: 100, padding: '2px 8px',
            fontSize: 11, fontWeight: 600,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: badge.dot }} />
            {status}
          </span>
        </div>
        <span style={{ color: '#534AB7', flexShrink: 0, marginLeft: 8, display: 'flex', alignItems: 'center' }}>
          <ArrowRight />
        </span>
      </div>

      {/* Neighbourhoods */}
      <div style={{ fontSize: 13, color: '#888', marginBottom: 14 }}>
        {assessment.neighbourhoods.join(' · ')}
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: '#f0f0f0', borderRadius: 2, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{
          height: '100%', background: '#534AB7', borderRadius: 2,
          width: `${pct}%`, minWidth: pct > 0 ? 4 : 0,
          transition: 'width 0.3s',
        }} />
      </div>

      {/* Footer stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#888' }}>
          {sectionsLeft} section{sectionsLeft !== 1 ? 's' : ''} remaining
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#534AB7' }}>{pct}%</span>
      </div>
    </button>
  )
}

// ── Question screen ───────────────────────────────────────────────────────────

function QuestionScreen({ assessment, q, selected, onSelect, onNext, onSkip, onBack }) {
  const domainPct = Math.round(((q.indexInDomain + 1) / q.domainTotal) * 100)
  const hasAnswer = selected !== undefined

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '18px 16px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onBack} style={{
          width: 34, height: 34, borderRadius: 8,
          border: '0.5px solid #e0e0e0', background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#333', flexShrink: 0,
        }}>
          <ChevronLeft />
        </button>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: '#111',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {q.domainName}
          </div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 1 }}>
            {q.indexInDomain + 1} of {q.domainTotal}
          </div>
        </div>
      </div>

      {/* 2px domain progress bar */}
      <div style={{ height: 2, background: '#eeeeee' }}>
        <div style={{
          height: '100%', width: `${domainPct}%`,
          background: '#534AB7', transition: 'width 0.25s',
        }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '22px 16px 0', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 17, fontWeight: 600, color: '#111',
          lineHeight: 1.55, marginBottom: 22, letterSpacing: '-0.1px',
        }}>
          {q.text}
        </div>

        {/* Likert options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {LIKERT.map(opt => {
            const active = selected === opt.value
            return (
              <button key={opt.value} onClick={() => onSelect(opt.value)} style={{
                display: 'flex', alignItems: 'center', gap: 11,
                padding: '12px 13px',
                border: `0.5px solid ${active ? '#7F77DD' : '#e0e0e0'}`,
                borderRadius: 8,
                background: active ? '#EEEDFE' : '#fff',
                cursor: 'pointer', textAlign: 'left', width: '100%',
              }}>
                <Radio selected={active} na={false} />
                <span style={{ fontSize: 14, color: '#111', fontWeight: active ? 600 : 400 }}>
                  {opt.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <div style={{ height: '0.5px', background: '#ebebeb', margin: '10px 0 7px' }} />

        {/* N/A */}
        <button onClick={() => onSelect('na')} style={{
          display: 'flex', alignItems: 'center', gap: 11,
          padding: '12px 13px',
          border: `0.5px solid ${selected === 'na' ? '#bfbfbf' : '#e8e8e8'}`,
          borderRadius: 8,
          background: selected === 'na' ? '#f5f5f5' : '#fff',
          cursor: 'pointer', textAlign: 'left', width: '100%',
        }}>
          <Radio selected={selected === 'na'} na />
          <span style={{ fontSize: 14, color: '#888', fontWeight: selected === 'na' ? 600 : 400 }}>
            Not applicable
          </span>
        </button>

        <div style={{ flex: 1, minHeight: 16 }} />
      </div>

      {/* Footer */}
      <div style={{
        padding: '14px 16px 28px', display: 'flex', gap: 8,
        borderTop: '0.5px solid #f0f0f0',
      }}>
        <button onClick={onSkip} style={{
          flex: 1, height: 44, borderRadius: 8,
          border: '0.5px solid #e0e0e0', background: '#fff',
          fontSize: 14, fontWeight: 500, color: '#666', cursor: 'pointer',
        }}>
          Skip
        </button>
        <button onClick={onNext} disabled={!hasAnswer} style={{
          flex: 2, height: 44, borderRadius: 8, border: 'none',
          background: hasAnswer ? '#534AB7' : '#ebebeb',
          color: hasAnswer ? '#fff' : '#bbb',
          fontSize: 14, fontWeight: 600,
          cursor: hasAnswer ? 'pointer' : 'default',
          transition: 'background 0.15s',
        }}>
          Next
        </button>
      </div>
    </div>
  )
}

// ── Radio circle ──────────────────────────────────────────────────────────────

function Radio({ selected, na }) {
  const accent = na ? '#9e9e9e' : '#7F77DD'
  return (
    <div style={{
      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
      border: `1.5px solid ${selected ? accent : '#d0d0d0'}`,
      background: selected ? accent : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {selected && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
    </div>
  )
}

// ── Thank you screen ──────────────────────────────────────────────────────────

function ThankYouScreen({ assessment, onBack }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 28px', textAlign: 'center',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: '#f0effe',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
      }}>
        <CheckIcon />
      </div>

      <div style={{ fontSize: 12, color: '#888', fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {assessment.home}
      </div>

      <h1 style={{
        fontSize: 23, fontWeight: 700, color: '#111',
        margin: '0 0 14px', letterSpacing: '-0.3px', lineHeight: 1.3,
      }}>
        That's a wrap — thank you
      </h1>

      <p style={{
        fontSize: 15, color: '#555', lineHeight: 1.7,
        margin: '0 0 40px', maxWidth: 290,
      }}>
        Your responses paint a real picture of {assessment.home}. The people who call it home are better off for it.
      </p>

      <button onClick={onBack} style={{
        width: '100%', height: 48, borderRadius: 8, border: 'none',
        background: '#534AB7', color: '#fff',
        fontSize: 15, fontWeight: 600, cursor: 'pointer',
      }}>
        Back to assessments
      </button>
    </div>
  )
}

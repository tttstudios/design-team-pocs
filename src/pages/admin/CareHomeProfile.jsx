import { useState, useMemo } from 'react'
import {
  Card, Button, Space, Typography, Avatar, Divider, message, Tooltip,
  Progress, Table, Dropdown, Popconfirm, Modal, Form, Input, InputNumber, Select, Drawer, Collapse, theme,
} from 'antd'
import {
  ArrowLeftOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined,
  UserOutlined, RightOutlined, EllipsisOutlined, MoreOutlined, PlusOutlined,
  SnippetsOutlined, FileTextOutlined, PlayCircleOutlined, BellOutlined,
  EditOutlined, DeleteOutlined, InboxOutlined, SettingOutlined, DownOutlined,
  CheckCircleOutlined, ClockCircleOutlined, TeamOutlined,
} from '@ant-design/icons'
import NotesTab from './NotesTab'
import CustomizeAssessment from './CustomizeAssessment'

const { Title, Text } = Typography

// ── Care home implementation status ──────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 'Lead',           bg: '#fffbe6', color: '#d46b08', dot: '#ffd591' },
  { value: 'Not Started',    bg: '#f5f5f5', color: '#595959', dot: '#bfbfbf' },
  { value: 'In Progress',    bg: '#fff7e6', color: '#d46b08', dot: '#faad14' },
  { value: 'Early Adoption', bg: '#e6f4ff', color: '#0958d9', dot: '#4096ff' },
  { value: 'Embedded',       bg: '#f6ffed', color: '#389e0d', dot: '#52c41a' },
]

// ── Assessment status config ──────────────────────────────────────────────────
const A_STATUS = {
  'In Progress': { bg: '#fff7e6', color: '#d46b08', dot: '#faad14' },
  'Not Started': { bg: '#f5f5f5', color: '#595959', dot: '#bfbfbf' },
  'Completed':   { bg: '#f6ffed', color: '#389e0d', dot: '#52c41a' },
}

const NB_STATUS = {
  'Never Assessed': { bg: '#f5f5f5', color: '#595959', dot: '#bfbfbf' },
  'Not Started':    { bg: '#f5f5f5', color: '#595959', dot: '#bfbfbf' },
  'In Progress':    { bg: '#fff7e6', color: '#d46b08', dot: '#faad14' },
  'Completed':      { bg: '#f6ffed', color: '#389e0d', dot: '#52c41a' },
}


const TABS = ['Overview', 'Assessment', 'Notes']

// ── Sample data ───────────────────────────────────────────────────────────────
const SAMPLE_ASSESSMENTS = [
  // ── Oak — Completed Dec 12 2026, 8d turnaround ──────────────────────────────
  {
    id: 1, neighbourhood: 'Oak', status: 'Completed',
    sentDate: new Date(2026, 11, 4), completedDate: new Date(2026, 11, 12),
    respondents: {
      completed: 5, total: 5,
      details: [
        { id: 1, name: 'Rachel Kim',     role: 'Registered Nurse', status: 'Completed', progress: 100 },
        { id: 2, name: 'Devon Clarke',   role: 'Care Aide',        status: 'Completed', progress: 100 },
        { id: 3, name: 'Ingrid Larsen',  role: 'Care Aide',        status: 'Completed', progress: 100 },
        { id: 4, name: 'Patrick Dubois', role: 'Registered Nurse', status: 'Completed', progress: 100 },
        { id: 5, name: 'Zoe Fernandez',  role: 'Care Aide',        status: 'Completed', progress: 100 },
      ],
    },
    overallScore: 3.27, homeOverall: 3.74,
    domainScores: [
      { domain: 'Choice and Flexibility',          score: 3.44, homeAvg: 3.70 },
      { domain: 'Meals and Dining',                score: 3.33, homeAvg: 3.65 },
      { domain: 'Personal Hygiene',                score: 2.92, homeAvg: 3.69 },
      { domain: 'Household Hygiene',               score: 3.08, homeAvg: 3.68 },
      { domain: 'Relationships & Connection',      score: 3.00, homeAvg: 3.70 },
      { domain: 'Hobbies & Meaningful Activity',   score: 3.17, homeAvg: 3.83 },
      { domain: 'Community Life & Belonging',      score: 3.82, homeAvg: 3.84 },
      { domain: 'Accessibility & Dementia Design', score: 3.47, homeAvg: 3.83 },
      { domain: 'Physical Environment',            score: 2.87, homeAvg: 3.67 },
      { domain: 'Operations & Workforce',          score: 2.75, homeAvg: 3.69 },
      { domain: 'Building Design & Tech',          score: 3.33, homeAvg: 3.84 },
      { domain: 'Measurement & Outcomes',          score: 4.07, homeAvg: 3.74 },
    ],
  },
  // ── Maple — Completed Dec 12 2026, 8d turnaround ────────────────────────────
  {
    id: 2, neighbourhood: 'Maple', status: 'Completed',
    sentDate: new Date(2026, 11, 4), completedDate: new Date(2026, 11, 12),
    respondents: {
      completed: 4, total: 4,
      details: [
        { id: 1, name: 'Sarah Chen',      role: 'Registered Nurse', status: 'Completed', progress: 100 },
        { id: 2, name: 'Marcus Williams', role: 'Care Aide',         status: 'Completed', progress: 100 },
        { id: 3, name: 'Priya Sharma',    role: 'Care Aide',         status: 'Completed', progress: 100 },
        { id: 4, name: 'Tom Bradley',     role: 'Registered Nurse',  status: 'Completed', progress: 100 },
      ],
    },
    overallScore: 3.65, homeOverall: 3.74,
    domainScores: [
      { domain: 'Choice and Flexibility',          score: 3.17, homeAvg: 3.70 },
      { domain: 'Meals and Dining',                score: 3.20, homeAvg: 3.65 },
      { domain: 'Personal Hygiene',                score: 3.44, homeAvg: 3.69 },
      { domain: 'Household Hygiene',               score: 3.38, homeAvg: 3.68 },
      { domain: 'Relationships & Connection',      score: 3.38, homeAvg: 3.70 },
      { domain: 'Hobbies & Meaningful Activity',   score: 3.81, homeAvg: 3.83 },
      { domain: 'Community Life & Belonging',      score: 3.95, homeAvg: 3.84 },
      { domain: 'Accessibility & Dementia Design', score: 3.71, homeAvg: 3.83 },
      { domain: 'Physical Environment',            score: 3.68, homeAvg: 3.67 },
      { domain: 'Operations & Workforce',          score: 3.90, homeAvg: 3.69 },
      { domain: 'Building Design & Tech',          score: 4.56, homeAvg: 3.84 },
      { domain: 'Measurement & Outcomes',          score: 3.63, homeAvg: 3.74 },
    ],
  },
  // ── Cedar — Completed Dec 12 2026, 8d turnaround ────────────────────────────
  {
    id: 3, neighbourhood: 'Cedar', status: 'Completed',
    sentDate: new Date(2026, 11, 4), completedDate: new Date(2026, 11, 12),
    respondents: {
      completed: 3, total: 3,
      details: [
        { id: 1, name: 'Fatima Al-Rashid', role: 'Registered Nurse', status: 'Completed', progress: 100 },
        { id: 2, name: 'Chris Nguyen',     role: 'Care Aide',         status: 'Completed', progress: 100 },
        { id: 3, name: 'Maya Patel',       role: 'Care Aide',         status: 'Completed', progress: 100 },
      ],
    },
    overallScore: 3.42, homeOverall: 3.74,
    domainScores: [
      { domain: 'Choice and Flexibility',          score: 3.30, homeAvg: 3.70 },
      { domain: 'Meals and Dining',                score: 3.50, homeAvg: 3.65 },
      { domain: 'Personal Hygiene',                score: 3.10, homeAvg: 3.69 },
      { domain: 'Household Hygiene',               score: 3.20, homeAvg: 3.68 },
      { domain: 'Relationships & Connection',      score: 3.40, homeAvg: 3.70 },
      { domain: 'Hobbies & Meaningful Activity',   score: 3.60, homeAvg: 3.83 },
      { domain: 'Community Life & Belonging',      score: 3.70, homeAvg: 3.84 },
      { domain: 'Accessibility & Dementia Design', score: 3.55, homeAvg: 3.83 },
      { domain: 'Physical Environment',            score: 3.25, homeAvg: 3.67 },
      { domain: 'Operations & Workforce',          score: 3.35, homeAvg: 3.69 },
      { domain: 'Building Design & Tech',          score: 3.45, homeAvg: 3.84 },
      { domain: 'Measurement & Outcomes',          score: 3.80, homeAvg: 3.74 },
    ],
  },
  // ── Willow — Completed Sep 19 2026, 5d turnaround ───────────────────────────
  {
    id: 4, neighbourhood: 'Willow', status: 'Completed',
    sentDate: new Date(2026, 8, 14), completedDate: new Date(2026, 8, 19),
    respondents: {
      completed: 4, total: 4,
      details: [
        { id: 1, name: 'Yusuf Hassan',  role: 'Care Aide',        status: 'Completed', progress: 100 },
        { id: 2, name: 'Tania Flores',  role: 'Registered Nurse', status: 'Completed', progress: 100 },
        { id: 3, name: 'Derek Osei',    role: 'Care Aide',         status: 'Completed', progress: 100 },
        { id: 4, name: 'Miriam Khalil', role: 'Registered Nurse', status: 'Completed', progress: 100 },
      ],
    },
    overallScore: 3.55, homeOverall: 3.74,
    domainScores: [
      { domain: 'Choice and Flexibility',          score: 3.50, homeAvg: 3.70 },
      { domain: 'Meals and Dining',                score: 3.60, homeAvg: 3.65 },
      { domain: 'Personal Hygiene',                score: 3.40, homeAvg: 3.69 },
      { domain: 'Household Hygiene',               score: 3.30, homeAvg: 3.68 },
      { domain: 'Relationships & Connection',      score: 3.55, homeAvg: 3.70 },
      { domain: 'Hobbies & Meaningful Activity',   score: 3.75, homeAvg: 3.83 },
      { domain: 'Community Life & Belonging',      score: 3.65, homeAvg: 3.84 },
      { domain: 'Accessibility & Dementia Design', score: 3.45, homeAvg: 3.83 },
      { domain: 'Physical Environment',            score: 3.35, homeAvg: 3.67 },
      { domain: 'Operations & Workforce',          score: 3.60, homeAvg: 3.69 },
      { domain: 'Building Design & Tech',          score: 3.70, homeAvg: 3.84 },
      { domain: 'Measurement & Outcomes',          score: 3.80, homeAvg: 3.74 },
    ],
  },
  // ── Site Overview — Completed Jan 18 2026, 15d turnaround ───────────────────
  {
    id: 5, neighbourhood: 'Site Overview', status: 'Completed',
    sentDate: new Date(2026, 0, 3), completedDate: new Date(2026, 0, 18),
    respondents: {
      completed: 6, total: 6,
      details: [
        { id: 1, name: 'Olivia Davis',   role: 'Director of Care',  status: 'Completed', progress: 100 },
        { id: 2, name: 'Sarah Chen',     role: 'Registered Nurse',  status: 'Completed', progress: 100 },
        { id: 3, name: 'Marcus Williams',role: 'Care Aide',          status: 'Completed', progress: 100 },
        { id: 4, name: 'Priya Sharma',   role: 'Care Aide',          status: 'Completed', progress: 100 },
        { id: 5, name: 'James Tran',     role: 'Registered Nurse',  status: 'Completed', progress: 100 },
        { id: 6, name: 'Diane Okafor',   role: 'Care Aide',          status: 'Completed', progress: 100 },
      ],
    },
    overallScore: 4.10, homeOverall: 3.74,
    domainScores: [
      { domain: 'Choice and Flexibility',          score: 4.20, homeAvg: 3.70 },
      { domain: 'Meals and Dining',                score: 4.10, homeAvg: 3.65 },
      { domain: 'Personal Hygiene',                score: 3.90, homeAvg: 3.69 },
      { domain: 'Household Hygiene',               score: 4.00, homeAvg: 3.68 },
      { domain: 'Relationships & Connection',      score: 4.15, homeAvg: 3.70 },
      { domain: 'Hobbies & Meaningful Activity',   score: 4.25, homeAvg: 3.83 },
      { domain: 'Community Life & Belonging',      score: 4.30, homeAvg: 3.84 },
      { domain: 'Accessibility & Dementia Design', score: 4.05, homeAvg: 3.83 },
      { domain: 'Physical Environment',            score: 3.95, homeAvg: 3.67 },
      { domain: 'Operations & Workforce',          score: 4.20, homeAvg: 3.69 },
      { domain: 'Building Design & Tech',          score: 4.10, homeAvg: 3.84 },
      { domain: 'Measurement & Outcomes',          score: 4.00, homeAvg: 3.74 },
    ],
  },
  // ── Historical Oak (prior round) ────────────────────────────────────────────
  {
    id: 6, neighbourhood: 'Oak', status: 'Completed',
    sentDate: new Date(2025, 8, 10), completedDate: new Date(2025, 9, 20),
    respondents: {
      completed: 4, total: 5,
      details: [
        { id: 1, name: 'Rachel Kim',     role: 'Registered Nurse',  status: 'Completed',   progress: 100 },
        { id: 2, name: 'Devon Clarke',   role: 'Care Aide',          status: 'Completed',   progress: 100 },
        { id: 3, name: 'Ingrid Larsen',  role: 'Care Aide',          status: 'Completed',   progress: 100 },
        { id: 4, name: 'Patrick Dubois', role: 'Registered Nurse',   status: 'Completed',   progress: 100 },
        { id: 5, name: 'Zoe Fernandez',  role: 'Care Aide',          status: 'Not Started', progress: 0   },
      ],
    },
    overallScore: 2.96, homeOverall: 3.58,
    domainScores: [
      { domain: 'Choice and Flexibility',          score: 3.10, homeAvg: 3.58 },
      { domain: 'Meals and Dining',                score: 3.05, homeAvg: 3.52 },
      { domain: 'Personal Hygiene',                score: 2.63, homeAvg: 3.55 },
      { domain: 'Household Hygiene',               score: 2.88, homeAvg: 3.54 },
      { domain: 'Relationships & Connection',      score: 2.75, homeAvg: 3.57 },
      { domain: 'Hobbies & Meaningful Activity',   score: 2.92, homeAvg: 3.70 },
      { domain: 'Community Life & Belonging',      score: 3.42, homeAvg: 3.71 },
      { domain: 'Accessibility & Dementia Design', score: 3.18, homeAvg: 3.70 },
      { domain: 'Physical Environment',            score: 2.60, homeAvg: 3.55 },
      { domain: 'Operations & Workforce',          score: 2.50, homeAvg: 3.56 },
      { domain: 'Building Design & Tech',          score: 3.08, homeAvg: 3.72 },
      { domain: 'Measurement & Outcomes',          score: 3.75, homeAvg: 3.62 },
    ],
  },
  {
    id: 7, neighbourhood: 'Maple Wing', status: 'Completed',
    sentDate: new Date(2025, 8, 10), completedDate: new Date(2025, 9, 18),
    respondents: {
      completed: 2, total: 2,
      details: [
        { id: 1, name: 'Sarah Chen',      role: 'Registered Nurse',  status: 'Completed', progress: 100 },
        { id: 2, name: 'Marcus Williams', role: 'Care Aide',         status: 'Completed', progress: 100 },
      ],
    },
    overallScore: 4.79, homeOverall: 3.58,
    domainScores: [
      { domain: 'Choice and Flexibility',          score: 5.00, homeAvg: 3.58 },
      { domain: 'Meals and Dining',                score: 4.20, homeAvg: 3.52 },
      { domain: 'Personal Hygiene',               score: 5.00, homeAvg: 3.55 },
      { domain: 'Household Hygiene',               score: 4.88, homeAvg: 3.54 },
      { domain: 'Relationships & Connection',      score: 5.00, homeAvg: 3.57 },
      { domain: 'Hobbies & Meaningful Activity',   score: 5.00, homeAvg: 3.70 },
      { domain: 'Community Life & Belonging',      score: 4.90, homeAvg: 3.71 },
      { domain: 'Accessibility & Dementia Design', score: 4.88, homeAvg: 3.70 },
      { domain: 'Physical Environment',            score: 4.50, homeAvg: 3.55 },
      { domain: 'Operations & Workforce',          score: 4.75, homeAvg: 3.56 },
      { domain: 'Building Design & Tech',          score: 4.50, homeAvg: 3.72 },
      { domain: 'Measurement & Outcomes',          score: 4.90, homeAvg: 3.62 },
    ],
  },
]

const INIT_NEIGHBOURHOODS = [
  { id: 1, name: 'Pine',          lastCompleted: null,                   assessmentSent: false },
  { id: 2, name: 'Oak',           lastCompleted: new Date(2026, 11, 12), assessmentSent: true  },
  { id: 3, name: 'Maple',         lastCompleted: new Date(2026, 11, 12), assessmentSent: true  },
  { id: 4, name: 'Cedar',         lastCompleted: new Date(2026, 11, 12), assessmentSent: true  },
  { id: 5, name: 'Willow',        lastCompleted: new Date(2026, 8, 19),  assessmentSent: true  },
  { id: 6, name: 'Site Overview', lastCompleted: new Date(2026, 0, 18),  assessmentSent: true  },
]

const SAMPLE_RESOURCES = [
  { id: 1, name: 'H4U Implementation Guide 2026.pdf', type: 'PDF',   size: '2.4 MB' },
  { id: 2, name: 'Staff Onboarding Video – Module 1', type: 'VIDEO', size: '48 MB'  },
  { id: 3, name: 'Care Standards Documentation.docx', type: 'DOC',   size: '1.1 MB' },
]

const SAMPLE_TEAM = [
  { id: 1, name: 'Olivia Davis',    role: 'Director of Care'  },
  { id: 2, name: 'Sarah Chen',      role: 'Registered Nurse'  },
  { id: 3, name: 'Marcus Williams', role: 'Care Aide'          },
  { id: 4, name: 'Priya Sharma',    role: 'Care Aide'          },
]

const ASSESSMENT_TEMPLATES = [
  { value: 'Existing Care Home', description: 'For homes already familiar with H4U practices. Focuses on adoption depth and areas for refinement.' },
  { value: 'New Care Home',      description: 'For homes beginning their H4U journey. Covers foundational practices and initial readiness.' },
]

// ── Assessment runs (one row per run) ─────────────────────────────────────────
const ASSESSMENT_RUNS = [
  { id:  1, neighbourhood: 'Site Overview', run: 1, sentDate: new Date(2026, 0, 18),  status: 'Completed', turnaround: 15,
    assessors: ['Jennifer Aniston', 'Bruce Lee', 'Jackie Chan', 'Chris Evans', 'Ryan Gosling', 'Anne Hathaway', 'Anna Kendrick', 'Karen Fukuhara'] },
  { id:  2, neighbourhood: 'Willow',        run: 1, sentDate: new Date(2026, 2, 19),  status: 'Completed', turnaround: 5,
    assessors: ['Jennifer Aniston', 'Jackie Chan', 'Chris Evans', 'Anna Kendrick'] },
  { id:  3, neighbourhood: 'Willow',        run: 2, sentDate: new Date(2026, 5, 19),  status: 'Completed', turnaround: 7,
    assessors: ['Jennifer Aniston', 'Jackie Chan', 'Chris Evans', 'Anna Kendrick'] },
  { id:  4, neighbourhood: 'Willow',        run: 3, sentDate: new Date(2026, 8, 19),  status: 'Completed', turnaround: 4,
    assessors: ['Jennifer Aniston', 'Jackie Chan', 'Chris Evans', 'Anna Kendrick'] },
  { id:  5, neighbourhood: 'Cedar',         run: 1, sentDate: new Date(2026, 2, 25),  status: 'Completed', turnaround: 8,
    assessors: ['Bruce Lee', 'Ryan Gosling', 'Kim Possible'] },
  { id:  6, neighbourhood: 'Cedar',         run: 2, sentDate: new Date(2026, 5, 26),  status: 'Completed', turnaround: 6,
    assessors: ['Bruce Lee', 'Ryan Gosling', 'Kim Possible'] },
  { id:  7, neighbourhood: 'Cedar',         run: 3, sentDate: new Date(2026, 8, 19),  status: 'Completed', turnaround: 9,
    assessors: ['Bruce Lee', 'Ryan Gosling', 'Kim Possible'] },
  { id:  8, neighbourhood: 'Cedar',         run: 4, sentDate: new Date(2026, 11, 12), status: 'Completed', turnaround: 12,
    assessors: ['Bruce Lee', 'Ryan Gosling', 'Kim Possible'] },
  { id:  9, neighbourhood: 'Maple',         run: 1, sentDate: new Date(2026, 8, 19),  status: 'Completed', turnaround: 6,
    assessors: ['Meryl Streep', 'Kim Possible', 'Chris Evans'] },
  { id: 10, neighbourhood: 'Maple',         run: 2, sentDate: new Date(2026, 11, 12), status: 'Completed', turnaround: 8,
    assessors: ['Meryl Streep', 'Kim Possible', 'Chris Evans'] },
  { id: 11, neighbourhood: 'Oak',           run: 1, sentDate: new Date(2026, 11, 12), status: 'Completed', turnaround: 8,
    assessors: ['Florence Pugh', 'Kim Possible', 'Chris Evans'] },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const daysSince = (date) => Math.floor((Date.now() - date) / 86400000)
const fmtShort  = (date) => date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })

function StatusPill({ statusMap, value }) {
  const cfg = statusMap[value] ?? { bg: '#f5f5f5', color: '#595959', dot: '#bfbfbf' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.color}44`,
      borderRadius: 100, padding: '2px 10px',
      fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {value}
    </span>
  )
}

const RESOURCE_TYPE = {
  PDF:   { Icon: SnippetsOutlined,   color: '#ff4d4f' },
  VIDEO: { Icon: PlayCircleOutlined, color: '#722ed1' },
  DOC:   { Icon: FileTextOutlined,   color: '#1677ff' },
}

// ── Radar / Spider chart ──────────────────────────────────────────────────────

const RADAR_LABELS = [
  ['Choice &', 'Flexibility'],
  ['Meals &', 'Dining'],
  ['Personal', 'Hygiene'],
  ['Household', 'Hygiene'],
  ['Relationships', '& Connection'],
  ['Hobbies &', 'Activity'],
  ['Community', 'Life'],
  ['Dementia', 'Design'],
  ['Physical', 'Environment'],
  ['Operations', '& Workforce'],
  ['Building', 'Design & Tech'],
  ['Measurement', '& Outcomes'],
]

function RadarChart({ domains, size = 360 }) {
  const cx = size / 2
  const cy = size / 2
  const n  = domains.length
  const r  = size * 0.29        // chart radius
  const lr = r + 26             // label radius

  const rad   = (i) => (2 * Math.PI / n) * i - Math.PI / 2
  const toXY  = (i, val) => {
    const a = rad(i), d = (Math.max(0, val) / 5) * r
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)]
  }
  const pts = (vals) => vals.map((v, i) => toXY(i, v).join(',')).join(' ')

  return (
    <svg width={size} height={size} style={{ overflow: 'visible', display: 'block' }}>
      {/* Grid rings */}
      {[1, 2, 3, 4, 5].map(v => (
        <polygon key={v}
          points={pts(Array(n).fill(v))}
          fill={v === 3 ? '#f7f7f7' : 'none'}
          stroke="#e8e8e8"
          strokeWidth={v === 5 ? 1.5 : 0.8}
        />
      ))}

      {/* Axis spokes */}
      {domains.map((_, i) => {
        const [x, y] = toXY(i, 5)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e8e8e8" strokeWidth={1} />
      })}

      {/* Home average polygon */}
      <polygon
        points={pts(domains.map(d => d.homeAvg))}
        fill="rgba(140,140,140,0.07)"
        stroke="#bfbfbf"
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />

      {/* Neighbourhood score polygon */}
      <polygon
        points={pts(domains.map(d => d.score))}
        fill="rgba(79,70,229,0.10)"
        stroke="#4F46E5"
        strokeWidth={2}
      />

      {/* Score dots */}
      {domains.map((d, i) => {
        const [x, y] = toXY(i, d.score)
        return <circle key={i} cx={x} cy={y} r={3.5} fill="#4F46E5" />
      })}

      {/* Ring scale labels (on top axis) */}
      {[1, 2, 3, 4, 5].map(v => {
        const [, y] = toXY(0, v)
        return (
          <text key={v} x={cx + 4} y={y - 3} fontSize={8} fill="#bfbfbf" textAnchor="start">
            {v}
          </text>
        )
      })}

      {/* Axis labels */}
      {RADAR_LABELS.map((lines, i) => {
        const a   = rad(i)
        const lx  = cx + lr * Math.cos(a)
        const ly  = cy + lr * Math.sin(a)
        const cos = Math.cos(a)
        const anchor = cos > 0.25 ? 'start' : cos < -0.25 ? 'end' : 'middle'
        const lh = 11
        const startY = ly - ((lines.length - 1) * lh) / 2
        return (
          <text key={i} fontSize={9.5} fill="#595959" textAnchor={anchor}>
            {lines.map((line, j) => (
              <tspan key={j} x={lx} y={startY + j * lh}>{line}</tspan>
            ))}
          </text>
        )
      })}
    </svg>
  )
}

// ── Domain bar chart ──────────────────────────────────────────────────────────

const DOMAIN_SHORT = {
  'Choice and Flexibility':          'Choice & Flexibility',
  'Meals and Dining':                'Meals & Dining',
  'Personal Hygiene':                'Personal Hygiene',
  'Household Hygiene':               'Household Hygiene',
  'Relationships & Connection':      'Relationships',
  'Hobbies & Meaningful Activity':   'Hobbies & Activity',
  'Community Life & Belonging':      'Community Life',
  'Accessibility & Dementia Design': 'Dementia Design',
  'Physical Environment':            'Physical Environment',
  'Operations & Workforce':          'Operations',
  'Building Design & Tech':          'Building & Tech',
  'Measurement & Outcomes':          'Measurement',
}

function DomainBarChart({ domainScores, homeOverall }) {
  const padL = 36, padR = 86, padT = 26, padB = 90
  const vbW = 580, vbH = 280
  const barAreaW = vbW - padL - padR
  const barAreaH = vbH - padT - padB
  const colW = barAreaW / domainScores.length
  const barW = Math.min(26, colW - 8)
  const barColor = (s) => s >= 4.0 ? '#52c41a' : s >= 3.0 ? '#faad14' : '#ff4d4f'
  const toY = (val) => padT + barAreaH - (Math.min(val, 5) / 5) * barAreaH
  const lineY = toY(homeOverall)
  const axisBaseY = padT + barAreaH

  return (
    <svg viewBox={`0 0 ${vbW} ${vbH}`} style={{ width: '100%', display: 'block', overflow: 'visible' }}>
      {/* Y-axis grid lines + labels */}
      {[1, 2, 3, 4, 5].map(v => {
        const y = toY(v)
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={vbW - padR} y2={y} stroke="#f0f0f0" strokeWidth={1} />
            <text x={padL - 8} y={y} textAnchor="end" dominantBaseline="middle" fontSize={11} fill="#8c8c8c">{v}</text>
          </g>
        )
      })}

      {/* Columns */}
      {domainScores.map(({ domain, score }, i) => {
        const cx  = padL + (i + 0.5) * colW
        const bx  = cx - barW / 2
        const bh  = (Math.min(score, 5) / 5) * barAreaH
        const by  = toY(score)
        const c   = barColor(score)
        const label = DOMAIN_SHORT[domain] ?? domain
        return (
          <g key={domain}>
            <rect x={bx} y={by} width={barW} height={bh} fill={c} rx={2} opacity={0.85} />
            <text x={cx} y={by - 5} textAnchor="middle" fontSize={10.5} fill={c} fontWeight={700}>
              {score.toFixed(1)}
            </text>
            <text
              x={cx} y={axisBaseY + 8}
              textAnchor="end" fontSize={11} fill="#595959"
              transform={`rotate(-42, ${cx}, ${axisBaseY + 8})`}
            >
              {label}
            </text>
          </g>
        )
      })}

      {/* Home avg horizontal dashed line */}
      <line x1={padL} y1={lineY} x2={vbW - padR} y2={lineY}
        stroke="#8c8c8c" strokeWidth={1.5} strokeDasharray="5,3" />
      <text x={vbW - padR + 8} y={lineY} dominantBaseline="middle" fontSize={11} fill="#595959" fontWeight={600}>
        Home avg
      </text>
      <text x={vbW - padR + 8} y={lineY + 14} dominantBaseline="middle" fontSize={11} fill="#8c8c8c">
        {homeOverall.toFixed(2)}
      </text>

      {/* Axes */}
      <line x1={padL} y1={axisBaseY} x2={vbW - padR} y2={axisBaseY} stroke="#d9d9d9" strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={axisBaseY} stroke="#d9d9d9" strokeWidth={1} />
    </svg>
  )
}

// ── Response distribution ─────────────────────────────────────────────────────

const DOMAIN_QS = [
  { name: 'Choice and Flexibility', questions: ['Residents participate in care planning', 'Residents choose family involvement', 'Staff adapt routines to preferences'] },
  { name: 'Meals and Dining', questions: ['Residents choose what, when, and where they eat', 'Residents participate in meal preparation', 'Cultural, religious, and dietary needs are supported', 'Mealtime pacing reflects resident preferences', 'Communal dining is optional, not required'] },
  { name: 'Personal Hygiene', questions: ['Residents choose when and how they bathe', 'Sensory preferences are respected', 'Residents are supported in self-care', 'Grooming reflects identity preferences'] },
  { name: 'Household Hygiene', questions: ['Residents and families can assist with laundry', 'Residents participate in household chores', 'Residents have control over personal items', 'Schedules reflect resident input'] },
  { name: 'Relationships & Connection', questions: ['Meaningful relational conversations happen regularly', "Staff know residents' life stories", 'Staffing supports continuity of relationships', 'Staff are educated on relational care'] },
  { name: 'Hobbies & Meaningful Activity', questions: ['Residents choose activities and timing', 'Individualized activity plans are in place', 'Both structured and spontaneous options are available', 'Isolated residents remain engaged'] },
  { name: 'Community Life & Belonging', questions: ['Residents choose their sleep and wake times', 'Families are welcomed as partners', 'Intergenerational interactions are available', 'Spiritual and religious practice is supported', 'Regular household discussion venues exist'] },
  { name: 'Accessibility & Dementia Design', questions: ['Staff receive dementia-friendly training', 'Spaces are sensory-appropriate', 'Clear wayfinding signage is in place', 'Noise levels are actively managed'] },
  { name: 'Physical Environment', questions: ['A small household model is in use', 'Shared kitchen and living spaces are used', 'Communal spaces are personalized', 'Outdoor areas are accessible year-round', 'Outdoor seating and shade are available'] },
  { name: 'Operations & Workforce', questions: ['Staffing supports flexibility in routines', 'Roles allow staff to adapt care', 'Teams can adjust routines in the moment', 'Onboarding reinforces resident autonomy', 'Staff wellness is actively supported'] },
  { name: 'Building Design & Tech', questions: ['Building features support people living with dementia', 'Lighting and temperature are adjustable', 'Technology preserves resident autonomy', 'Community business partnerships are active'] },
  { name: 'Measurement & Outcomes', questions: ['Resident satisfaction is measured regularly', 'Health outcomes are tracked', 'Staff retention is monitored', 'Data is shared with stakeholders', 'Qualitative stories complement quantitative data'] },
]

const LIKERT_CFG = [
  { val: 5, label: 'Always',    color: '#52c41a' },
  { val: 4, label: 'Often',     color: '#95de64' },
  { val: 3, label: 'Sometimes', color: '#faad14' },
  { val: 2, label: 'Rarely',    color: '#ff7a45' },
  { val: 1, label: 'Never',     color: '#ff4d4f' },
]

const ANSWER_CFG = {
  5: { label: 'Always',    short: 'A', color: '#389e0d', bg: '#f6ffed', border: '#b7eb8f' },
  4: { label: 'Often',     short: 'O', color: '#7cb305', bg: '#fcffe6', border: '#d3f261' },
  3: { label: 'Sometimes', short: 'S', color: '#d46b08', bg: '#fff7e6', border: '#ffd591' },
  2: { label: 'Rarely',    short: 'R', color: '#d4380d', bg: '#fff2e8', border: '#ffbb96' },
  1: { label: 'Never',     short: 'N', color: '#cf1322', bg: '#fff1f0', border: '#ffa39e' },
}

function computeQData(domainScores, n) {
  return domainScores.map(({ domain, score }, di) => {
    const def = DOMAIN_QS.find(d => d.name === domain)
    const questions = def?.questions || []
    return {
      domain,
      score,
      questions: questions.map((text, qi) => {
        const answers = Array.from({ length: n }, (_, ri) => {
          const seed = (di * 100 + qi * 10 + ri) * 2654435761
          const hash = ((seed >>> 0) % 1000) / 1000
          const noise = (hash - 0.5) * 2.4
          return Math.min(5, Math.max(1, Math.round(score + noise)))
        })
        return { text, answers }
      }),
    }
  })
}

function ResponseDistributionView({ domainScores, respondents }) {
  const completed = respondents.details.filter(r => r.status === 'Completed')
  const n = completed.length

  const qData = useMemo(
    () => computeQData(domainScores, n),
    [domainScores, n],
  )

  const BUBBLE_SIZE = 34

  const items = qData.map(({ domain, score, questions }, di) => ({
    key: String(di),
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Text strong style={{ fontSize: 13 }}>{domain}</Text>
        <Text style={{
          fontSize: 12, fontWeight: 700,
          color: score >= 4.0 ? '#389e0d' : score >= 3.0 ? '#d46b08' : '#cf1322',
        }}>
          {score.toFixed(2)}<Text type="secondary" style={{ fontSize: 11, fontWeight: 400 }}> / 5</Text>
        </Text>
      </div>
    ),
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Respondent header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 6, borderBottom: '1px solid #f0f0f0', marginBottom: 4 }}>
          <div style={{ width: 260, flexShrink: 0 }} />
          {completed.map(r => {
            const ini = r.name.split(' ').map(w => w[0]).join('')
            return (
              <div key={r.id} title={`${r.name} · ${r.role}`}
                style={{ width: BUBBLE_SIZE, flexShrink: 0, textAlign: 'center', fontSize: 10, color: '#8c8c8c', fontWeight: 600 }}>
                {ini}
              </div>
            )
          })}
        </div>

        {/* Question rows */}
        {questions.map(({ text, answers }, qi) => {
          const allSame = answers.every(a => a === answers[0])
          const hasDisagreement = !allSame
          return (
            <div key={qi} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 8px', margin: '0 -8px', borderRadius: 6,
              background: hasDisagreement ? '#fffbe6' : 'transparent',
              borderLeft: hasDisagreement ? '3px solid #faad14' : '3px solid transparent',
            }}>
              <Text style={{ width: 260, minWidth: 260, fontSize: 12, color: '#595959', lineHeight: 1.4 }}>
                {text}
              </Text>
              {answers.map((ans, ri) => {
                const cfg = ANSWER_CFG[ans] ?? ANSWER_CFG[3]
                return (
                  <div key={ri}
                    title={`${completed[ri]?.name}: ${cfg.label}`}
                    style={{
                      width: BUBBLE_SIZE, height: BUBBLE_SIZE, flexShrink: 0,
                      borderRadius: '50%', border: `2px solid ${cfg.border}`,
                      background: cfg.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 800, color: cfg.color,
                      cursor: 'default',
                    }}>
                    {cfg.short}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    ),
  }))

  return (
    <Card style={{ borderRadius: 10, marginTop: 16 }} styles={{ body: { padding: 0 } }}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, padding: '14px 20px 12px', flexWrap: 'wrap', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
        <Text style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 600, marginRight: 4 }}>Response key:</Text>
        {Object.values(ANSWER_CFG).map(({ short, label, color, bg, border }) => (
          <Space key={short} size={6}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', border: `2px solid ${border}`,
              background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 800, color, flexShrink: 0,
            }}>{short}</div>
            <Text style={{ fontSize: 12, color: '#595959' }}>{label}</Text>
          </Space>
        ))}
        <Space size={6} style={{ marginLeft: 8 }}>
          <div style={{ width: 3, height: 16, background: '#faad14', borderRadius: 2 }} />
          <Text style={{ fontSize: 12, color: '#8c8c8c' }}>Disagreement</Text>
        </Space>
      </div>
      <Collapse ghost items={items} defaultActiveKey={['0']} style={{ padding: '4px 4px' }} />
    </Card>
  )
}

// ── Assessment Tab ────────────────────────────────────────────────────────────

function AssessmentNeighbourhoodDetail({ assessment, onBack }) {
  const [view, setView] = useState('individual') // 'individual' | 'aggregated'
  const { respondents, domainScores } = assessment
  const fmt = (d) => d?.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })

  const respondentStatusCfg = {
    'Completed':   { color: '#389e0d', bg: '#f6ffed', dot: '#52c41a' },
    'In Progress': { color: '#d46b08', bg: '#fff7e6', dot: '#faad14' },
    'Not Started': { color: '#595959', bg: '#f5f5f5', dot: '#bfbfbf' },
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Back + header */}
      <div style={{ marginBottom: 24 }}>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={onBack}
          style={{ padding: 0, color: '#8c8c8c', fontSize: 13, marginBottom: 12 }}>
          All assessments
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Text strong style={{ fontSize: 20 }}>{assessment.neighbourhood}</Text>
          <StatusPill statusMap={A_STATUS} value={assessment.status} />
        </div>
        <Space size={16} style={{ marginTop: 6 }}>
          <Text type="secondary" style={{ fontSize: 13 }}>Sent {fmt(assessment.sentDate)}</Text>
          {assessment.completedDate && (
            <Text type="secondary" style={{ fontSize: 13 }}>Completed {fmt(assessment.completedDate)}</Text>
          )}
          <Text type="secondary" style={{ fontSize: 13 }}>
            {respondents.completed}/{respondents.total} respondents
          </Text>
        </Space>
      </div>

      {/* View toggle */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', width: 'fit-content' }}>
        {['individual', 'aggregated'].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: '7px 20px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            background: view === v ? '#4F46E5' : '#fff',
            color: view === v ? '#fff' : '#595959',
            transition: 'all 0.15s',
          }}>
            {v === 'individual' ? 'Individual responses' : 'Aggregated results'}
          </button>
        ))}
      </div>

      {/* Individual view */}
      {view === 'individual' && (
        <Card style={{ borderRadius: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {respondents.details.map((r, i) => {
              const cfg = respondentStatusCfg[r.status] ?? respondentStatusCfg['Not Started']
              const ini = r.name.split(' ').map(n => n[0]).join('').toUpperCase()
              return (
                <div key={r.id}>
                  {i > 0 && <Divider style={{ margin: 0 }} />}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0' }}>
                    <Avatar size={36} style={{ background: '#4F46E5', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{ini}</Avatar>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text strong style={{ fontSize: 14, display: 'block' }}>{r.name}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{r.role}</Text>
                    </div>
                    {r.status === 'In Progress' && (
                      <div style={{ width: 120 }}>
                        <Progress percent={r.progress} size="small" showInfo={false}
                          strokeColor="#4F46E5" railColor="#e5e7eb" />
                        <Text type="secondary" style={{ fontSize: 11 }}>{r.progress}% complete</Text>
                      </div>
                    )}
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: cfg.bg, color: cfg.color,
                      border: `1px solid ${cfg.color}44`,
                      borderRadius: 100, padding: '2px 10px',
                      fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
                    }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot }} />
                      {r.status}
                    </span>
                    {r.status !== 'Completed' && (
                      <Button size="small" icon={<BellOutlined />}>Remind</Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Aggregated view */}
      {view === 'aggregated' && (
        domainScores ? (
          <>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

            {/* Left — radar chart */}
            <Card style={{ borderRadius: 10, flexShrink: 0 }} styles={{ body: { padding: '20px 16px 14px' } }}>
              <RadarChart domains={domainScores} size={340} />
              {/* Legend */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 10 }}>
                <Space size={6}>
                  <div style={{ width: 18, height: 3, background: '#4F46E5', borderRadius: 2 }} />
                  <Text style={{ fontSize: 11, color: '#595959' }}>Neighbourhood</Text>
                </Space>
                <Space size={6}>
                  <svg width={18} height={3}><line x1={0} y1={1.5} x2={18} y2={1.5} stroke="#bfbfbf" strokeWidth={2} strokeDasharray="4,2" /></svg>
                  <Text style={{ fontSize: 11, color: '#595959' }}>Home average</Text>
                </Space>
              </div>
            </Card>

            {/* Right — overall scores + domain bars */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Overall score banner */}
              <Card style={{ borderRadius: 10, marginBottom: 12, background: '#f9fafb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, display: 'block', marginBottom: 2 }}>
                      Neighbourhood score
                    </Text>
                    <Text strong style={{ fontSize: 26, color: '#4F46E5' }}>{assessment.overallScore?.toFixed(2)}</Text>
                    <Text type="secondary" style={{ fontSize: 13 }}> / 5</Text>
                  </div>
                  <div style={{ width: 1, height: 36, background: '#e5e7eb', flexShrink: 0 }} />
                  <div>
                    <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, display: 'block', marginBottom: 2 }}>
                      Home average
                    </Text>
                    <Text strong style={{ fontSize: 26, color: '#8c8c8c' }}>{assessment.homeOverall?.toFixed(2)}</Text>
                    <Text type="secondary" style={{ fontSize: 13 }}> / 5</Text>
                  </div>
                  <div style={{ width: 1, height: 36, background: '#e5e7eb', flexShrink: 0 }} />
                  <div>
                    <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, display: 'block', marginBottom: 2 }}>
                      vs. Home avg
                    </Text>
                    {(() => {
                      const delta = assessment.overallScore - assessment.homeOverall
                      const color = delta >= 0 ? '#389e0d' : '#cf1322'
                      return <Text strong style={{ fontSize: 20, color }}>{delta >= 0 ? '+' : ''}{delta.toFixed(2)}</Text>
                    })()}
                  </div>
                </div>
              </Card>

              {/* Domain bar chart */}
              <Card style={{ borderRadius: 8 }} styles={{ body: { padding: '16px 20px 12px' } }}>
                <DomainBarChart domainScores={domainScores} homeOverall={assessment.homeOverall} />
              </Card>
            </div>

          </div>

          {/* Response distribution — all respondents, all questions */}
          <ResponseDistributionView
            domainScores={domainScores}
            respondents={assessment.respondents}
          />
          </>
        ) : (
          <Card style={{ borderRadius: 10, textAlign: 'center', padding: '32px 0' }}>
            <Text type="secondary">Aggregated results are available once the assessment is completed.</Text>
          </Card>
        )
      )}
    </div>
  )
}

function AssessmentTab({ onView }) {
  const fmt = (d) => d?.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })

  const columns = [
    {
      title: 'Neighbourhood',
      dataIndex: 'neighbourhood',
      key: 'neighbourhood',
      width: '25%',
      render: (name) => <Text strong style={{ fontSize: 14 }}>{name}</Text>,
    },
    {
      title: 'Sent Date',
      dataIndex: 'sentDate',
      key: 'sentDate',
      width: '25%',
      sorter: (a, b) => a.sentDate - b.sentDate,
      render: (d, row) => (
        <div>
          <Text style={{ fontSize: 13, display: 'block' }}>{fmt(d)}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{row.turnaround}d turnaround</Text>
        </div>
      ),
    },
    {
      title: 'Respondents',
      key: 'assessors',
      width: '25%',
      render: (_, row) => (
        <Text style={{ fontSize: 13 }}>{row.assessors.length}</Text>
      ),
    },
    {
      title: '',
      key: 'action',
      width: '25%',
      render: (_, a) => (
        <Button size="small" onClick={() => onView(a)}>View</Button>
      ),
    },
  ]

  return (
    <Table
      dataSource={ASSESSMENT_RUNS.map(a => ({ ...a, key: a.id }))}
      columns={columns}
      pagination={false}
      size="middle"
      locale={{ emptyText: 'No assessments yet.' }}
    />
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CareHomeProfile({ careHome }) {
  const { token } = theme.useToken()
  const [customizing, setCustomizing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedRun, setSelectedRun] = useState(null)
  const [status, setStatus]       = useState(careHome.status ?? 'Not Started')
  const [messageApi, ctx]         = message.useMessage()

  const statusOpt = STATUS_OPTIONS.find(o => o.value === status) ?? STATUS_OPTIONS[1]

  const handleStatusChange = ({ key }) => {
    setStatus(key)
    messageApi.success(`Status updated to "${key}"`)
  }

  const statusMenuItems = STATUS_OPTIONS.map(o => ({
    key: o.value,
    label: (
      <Space size={10}>
        <span style={{
          display: 'inline-block', width: 10, height: 10,
          borderRadius: '50%', background: o.dot, flexShrink: 0,
        }} />
        {o.value}
      </Space>
    ),
  }))

  const hasLeader = !!careHome.homeLeader
  const initials  = hasLeader
    ? careHome.homeLeader.name.split(' ').map((n) => n[0]).join('')
    : null

  // ── Care home details (locally editable) ──────────────────────────────────
  const [details, setDetails] = useState({
    name: careHome.name,
    beds: careHome.beds,
    address1: careHome.address ?? '',
    address2: '',
    country: 'Canada',
    province: 'British Columbia',
    postalCode: '',
  })
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)
  const [editForm] = Form.useForm()

  const openEditDrawer = () => {
    editForm.setFieldsValue(details)
    setEditDrawerOpen(true)
  }
  const saveDetails = () => {
    editForm.validateFields().then((values) => {
      setDetails(values)
      setEditDrawerOpen(false)
      messageApi.success('Care home details updated.')
    }).catch(() => {})
  }

  // ── Overview state ─────────────────────────────────────────────────────────
  const [assessments, setAssessments]       = useState(SAMPLE_ASSESSMENTS)
  const [neighbourhoods, setNeighbourhoods] = useState(INIT_NEIGHBOURHOODS)
  const [nbModal, setNbModal]     = useState({ open: false, mode: 'add', record: null })
  const [nbForm]                  = Form.useForm()
  const [sendModal, setSendModal] = useState({ open: false, record: null, members: [], template: 'Existing Care Home', addingMember: null })
  const [hoveredResource, setHoveredResource] = useState(null)
  const [hoveredMember, setHoveredMember] = useState(null)
  const [respondentDrawer, setRespondentDrawer] = useState({ open: false, assessment: null })

  const openAddNb = () => {
    nbForm.resetFields()
    setNbModal({ open: true, mode: 'add', record: null })
  }

  const openEditNb = (record) => {
    nbForm.setFieldsValue({ name: record.name })
    setNbModal({ open: true, mode: 'edit', record })
  }

  const saveNb = () => {
    nbForm.validateFields().then((values) => {
      if (nbModal.mode === 'add') {
        setNeighbourhoods(prev => [...prev, {
          id: Date.now(), name: values.name,
          lastCompleted: null, assessmentSent: false,
        }])
        messageApi.success('Neighbourhood added.')
      } else {
        setNeighbourhoods(prev => prev.map(n =>
          n.id === nbModal.record.id
            ? { ...n, name: values.name }
            : n
        ))
        messageApi.success('Neighbourhood updated.')
      }
      setNbModal({ open: false, mode: 'add', record: null })
    }).catch(() => {})
  }

  const deleteNb = (record) => {
    Modal.confirm({
      title: 'Delete neighbourhood?',
      content: `"${record.name}" will be permanently removed.`,
      okText: 'Delete', okType: 'danger',
      onOk: () => {
        setNeighbourhoods(prev => prev.filter(n => n.id !== record.id))
        messageApi.success('Neighbourhood deleted.')
      },
    })
  }

  const archiveNb = (record) => {
    Modal.confirm({
      title: 'Archive neighbourhood?',
      content: `"${record.name}" will be archived and hidden from active views.`,
      okText: 'Archive',
      onOk: () => {
        setNeighbourhoods(prev => prev.filter(n => n.id !== record.id))
        messageApi.success('Neighbourhood archived.')
      },
    })
  }

  const handleSendAssessment = () => {
    const record = sendModal.record
    const name   = record?.name
    // Add a new assessment card
    setAssessments(prev => [...prev, {
      id: Date.now(),
      neighbourhood: name,
      status: 'Not Started',
      sentDate: new Date(),
      respondents: {
        completed: 0,
        total: sendModal.members.length,
        details: sendModal.members.map(m => ({
          id: m.id, name: m.name, role: m.role ?? 'Team Member',
          status: 'Not Started', progress: 0,
        })),
      },
    }])
    setNeighbourhoods(prev => prev.map(n =>
      n.id === record?.id ? { ...n, assessmentSent: true } : n
    ))
    setSendModal({ open: false, record: null, members: [], template: 'Existing Care Home', addingMember: null })
    messageApi.success(`Assessment created for ${name}.`)
  }

  const handleSendReminder = (assessment) => {
    try {
      messageApi.success(`Reminder sent for ${assessment.neighbourhood}.`)
    } catch {
      messageApi.error('Failed to send reminder. Please try again.')
    }
  }

  // Merge neighbourhoods with their latest assessment
  const nbRows = useMemo(() => {
    return neighbourhoods.map(nb => {
      const latest = assessments
        .filter(a => a.neighbourhood === nb.name)
        .sort((a, b) => b.sentDate - a.sentDate)[0] ?? null
      return { ...nb, key: nb.id, latestAssessment: latest }
    })
  }, [neighbourhoods, assessments])

  const fmtDate = (d) => d?.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }) ?? ''
  const turnaround = (sent, done) => Math.round((done - sent) / 86400000)

  // Unified neighbourhood table columns (matches Figma)
  const nbColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      onHeaderCell: () => ({ style: { paddingLeft: 20 } }),
      render: (name) => <Text strong style={{ fontSize: 14, paddingLeft: 12 }}>{name}</Text>,
    },
    {
      title: 'Assessment Status',
      key: 'status',
      width: '25%',
      render: (_, row) => {
        const statusLabel = row.latestAssessment?.status ?? 'Never Assessed'
        if (statusLabel === 'Never Assessed') {
          return <Text type="secondary" style={{ fontSize: 13 }}>Never Assessed</Text>
        }
        const cfg = NB_STATUS[statusLabel] ?? NB_STATUS['Not Started']
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: cfg.bg, color: cfg.color,
            border: `1px solid ${cfg.color}44`,
            borderRadius: 100, padding: '2px 10px',
            fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
            {statusLabel}
          </span>
        )
      },
    },
    {
      title: 'Progress & Activity',
      key: 'activity',
      width: '25%',
      render: (_, row) => {
        const a = row.latestAssessment
        if (!a) return <Text type="secondary" style={{ fontSize: 13 }}>- -</Text>
        if (a.status === 'Completed' && a.completedDate) {
          const days = turnaround(a.sentDate, a.completedDate)
          return (
            <div>
              <Text style={{ fontSize: 13, display: 'block' }}>{fmtDate(a.completedDate)}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>{days}d turnaround</Text>
            </div>
          )
        }
        const { completed, total } = a.respondents
        return (
          <div>
            <Text style={{ fontSize: 13, display: 'block' }}>Sent {fmtDate(a.sentDate)}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{completed} / {total} respondents</Text>
          </div>
        )
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '25%',
      render: (_, row) => {
        const isCompleted = row.latestAssessment?.status === 'Completed'
        const iconBtn = (icon, onClick, title) => (
          <Tooltip title={title}>
            <Button
              icon={icon}
              onClick={onClick}
              size="small"
              style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
            />
          </Tooltip>
        )
        return (
          <Space size={4}>
            {isCompleted && iconBtn(
              <SnippetsOutlined />,
              () => setActiveTab('assessment'),
              'View report'
            )}
            {iconBtn(
              <PlusOutlined />,
              () => setSendModal({ open: true, record: row, members: [...SAMPLE_TEAM], template: 'Existing Care Home', addingMember: null }),
              'Send assessment'
            )}
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  { key: 'edit', label: 'Edit neighbourhood', icon: <EditOutlined /> },
                  { key: 'delete', label: 'Delete', danger: true, icon: <DeleteOutlined /> },
                ],
                onClick: ({ key }) => {
                  if (key === 'edit')   openEditNb(row)
                  if (key === 'delete') deleteNb(row)
                },
              }}
            >
              {iconBtn(<EllipsisOutlined />, () => {}, 'More options')}
            </Dropdown>
          </Space>
        )
      },
    },
  ]

  // ── Overview tab render ────────────────────────────────────────────────────
  const renderOverview = () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

      {/* Main column — single Neighbourhoods table */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text strong style={{ fontSize: 20, color: '#153B73', fontFamily: "'Literata', Georgia, serif" }}>Neighbourhoods</Text>
          <Button type="text" icon={<PlusOutlined />} onClick={openAddNb}
            style={{ color: '#595959', fontSize: 13 }}>
            Add neighbourhood
          </Button>
        </div>
        <Table
          dataSource={nbRows}
          columns={nbColumns}
          pagination={false}
          size="middle"
          bordered={false}
          style={{ borderRadius: 10, overflow: 'hidden', boxShadow: token.boxShadowSecondary }}
          locale={{ emptyText: 'No neighbourhoods added yet.' }}
        />
      </div>

      {/* Sidebar */}
      <div style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Care Home Team */}
        <Card
          title={<Text strong style={{ fontSize: 14 }}>Care home team</Text>}
          style={{ borderRadius: 10, boxShadow: token.boxShadowSecondary }}
        >
          {hasLeader ? (
            <>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Avatar size={40} style={{ background: '#4F46E5', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                  {initials}
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ marginBottom: 2 }}>
                    <Text strong style={{ fontSize: 14 }}>{careHome.homeLeader.name}</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 13 }}>{careHome.homeLeader.title}</Text>
                </div>
              </div>
              <Space orientation="vertical" size={6} style={{ width: '100%', marginTop: 12 }}>
                <Space size={8}>
                  <MailOutlined style={{ color: '#8c8c8c', fontSize: 13 }} />
                  <Text style={{ fontSize: 13 }}>{careHome.homeLeader.email}</Text>
                </Space>
                <Space size={8}>
                  <PhoneOutlined style={{ color: '#8c8c8c', fontSize: 13 }} />
                  <Text style={{ fontSize: 13 }}>{careHome.homeLeader.phone}</Text>
                </Space>
              </Space>
              <Divider style={{ margin: '12px 0' }} />
              <Space size={6}>
                <UserOutlined style={{ color: '#8c8c8c', fontSize: 13 }} />
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {careHome.teamMemberCount ?? 0} team member{(careHome.teamMemberCount ?? 0) !== 1 ? 's' : ''} in total
                </Text>
              </Space>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                No Home Leader assigned yet
              </Text>
              <Button type="primary" size="small">Add Home Leader</Button>
            </div>
          )}
        </Card>

        {/* Shared Resources */}
        <Card
          title={<Text strong style={{ fontSize: 14 }}>Shared resources</Text>}
          extra={
            <Button type="link" size="small" style={{ padding: 0, fontSize: 13 }}
              onClick={() => setActiveTab('resources')}>
              See all <RightOutlined style={{ fontSize: 10 }} />
            </Button>
          }
          style={{ borderRadius: 10, boxShadow: token.boxShadowSecondary }}
        >
          {SAMPLE_RESOURCES.length > 0 ? (
            <div>
              {SAMPLE_RESOURCES.slice(0, 3).map((r, i) => {
                const rt = RESOURCE_TYPE[r.type] ?? RESOURCE_TYPE.DOC
                const { Icon } = rt
                return (
                  <div key={r.id}>
                    {i > 0 && <Divider style={{ margin: 0 }} />}
                    <div
                      style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredResource(r.id)}
                      onMouseLeave={() => setHoveredResource(null)}
                    >
                      <div style={{
                        width: 34, height: 34, borderRadius: 8,
                        background: rt.color + '18',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Icon style={{ color: rt.color, fontSize: 16 }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text style={{
                          display: 'block', fontSize: 13,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {r.name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{r.type} · {r.size}</Text>
                      </div>
                      <RightOutlined style={{
                        fontSize: 12, color: '#1677ff', flexShrink: 0,
                        opacity: hoveredResource === r.id ? 1 : 0,
                        transition: 'opacity 0.15s',
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 10 }}>
                No resources shared yet
              </Text>
              <Button size="small" icon={<PlusOutlined />}>Add resource</Button>
            </div>
          )}
        </Card>

      </div>
    </div>
  )

  if (customizing) {
    return <CustomizeAssessment careHome={careHome} onBack={() => setCustomizing(false)} />
  }

  if (selectedRun) {
    const detailAssessment = {
      ...selectedRun,
      respondents: {
        completed: selectedRun.assessors.length,
        total: selectedRun.assessors.length,
        details: selectedRun.assessors.map((name, i) => ({
          id: i + 1, name, role: 'Assessor', status: 'Completed', progress: 100,
        })),
      },
    }
    return (
      <div style={{ background: '#F9F4EE', minHeight: '100%' }}>
        {ctx}
        <AssessmentNeighbourhoodDetail assessment={detailAssessment} onBack={() => setSelectedRun(null)} />
      </div>
    )
  }

  return (
    <div style={{ background: '#F9F4EE', minHeight: '100%' }}>
      {ctx}

      {/* ── White header ── */}
      <div style={{ background: '#fff', padding: '20px 40px 0', borderBottom: '1px solid #f0f0f0' }}>

        {/* Name + inline status select + header actions */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Title level={2} style={{ margin: 0, fontFamily: "'Literata', Georgia, serif", color: '#153B73' }}>{details.name}</Title>
            <Dropdown
              menu={{ items: statusMenuItems, onClick: handleStatusChange, selectedKeys: [status] }}
              trigger={['click']}
            >
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: statusOpt.bg,
                color: statusOpt.color,
                border: `1px solid ${statusOpt.color}44`,
                borderRadius: 100,
                padding: '4px 12px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                userSelect: 'none',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: statusOpt.dot, display: 'inline-block', flexShrink: 0,
                }} />
                {status}
                <DownOutlined style={{ fontSize: 10, marginLeft: 2 }} />
              </div>
            </Dropdown>
          </div>
          <Space style={{ flexShrink: 0, paddingTop: 4 }}>
            <Button icon={<EditOutlined />} onClick={openEditDrawer}>Edit care home details</Button>
            <Button icon={<SettingOutlined />} type="primary" onClick={() => setCustomizing(true)}>Customize assessment</Button>
          </Space>
        </div>

        {/* Address + beds */}
        <Space size={12} style={{ marginBottom: 20 }}>
          <Space size={5}>
            <EnvironmentOutlined style={{ color: '#8c8c8c', fontSize: 13 }} />
            <Text type="secondary" style={{ fontSize: 13 }}>
              {[details.address1, details.address2, details.province, details.postalCode].filter(Boolean).join(', ')}
            </Text>
          </Space>
          <Text type="secondary" style={{ fontSize: 13 }}>·</Text>
          <Space size={5}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', marginBottom: 1 }}>
              <path d="M3 10V7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3" stroke="#8c8c8c" strokeWidth="1.8" strokeLinecap="round"/>
              <rect x="2" y="10" width="20" height="7" rx="2" stroke="#8c8c8c" strokeWidth="1.8"/>
              <path d="M2 17v3M22 17v3" stroke="#8c8c8c" strokeWidth="1.8" strokeLinecap="round"/>
              <rect x="7" y="10" width="4" height="4" rx="1" fill="#8c8c8c" opacity="0.4"/>
              <rect x="13" y="10" width="4" height="4" rx="1" fill="#8c8c8c" opacity="0.4"/>
            </svg>
            <Text type="secondary" style={{ fontSize: 13 }}>{details.beds} beds</Text>
          </Space>
        </Space>

        {/* Tab bar */}
        <div style={{ display: 'flex' }}>
          {TABS.map((tab) => {
            const key    = tab.toLowerCase()
            const active = activeTab === key
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '10px 20px 12px',
                  fontSize: 14, fontWeight: active ? 600 : 400,
                  color: active ? '#153B73' : '#595959',
                  borderBottom: active ? '2px solid #153B73' : '2px solid transparent',
                  marginBottom: -1,
                  transition: 'color 0.15s',
                }}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div style={{ padding: '28px 40px 48px' }}>
        {activeTab === 'overview'    && renderOverview()}
        {activeTab === 'assessment'  && <AssessmentTab onView={setSelectedRun} />}
        {activeTab === 'notes'       && <NotesTab careHome={careHome} />}
      </div>

      {/* ── Add / Edit neighbourhood modal ── */}
      <Drawer
        title={nbModal.mode === 'add' ? 'Add neighbourhood' : 'Edit neighbourhood'}
        open={nbModal.open}
        onClose={() => setNbModal({ open: false, mode: 'add', record: null })}
        width={480}
        destroyOnHidden
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setNbModal({ open: false, mode: 'add', record: null })}>Cancel</Button>
            <Button type="primary" onClick={saveNb}>Save</Button>
          </div>
        }
      >
        <Form form={nbForm} layout="vertical">
          <Form.Item name="name" label="Name"
            rules={[{ required: true, message: 'Name is required.' }]}
            style={{ marginBottom: 0 }}>
            <Input placeholder="e.g. Maple Wing" />
          </Form.Item>
        </Form>
      </Drawer>

      {/* ── Create new assessment drawer ── */}
      <Drawer
        title="Create new assessment"
        open={sendModal.open}
        onClose={() => setSendModal({ open: false, record: null, members: [], template: 'Existing Care Home', addingMember: null })}
        width={480}
        destroyOnHidden
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setSendModal({ open: false, record: null, members: [], template: 'Existing Care Home', addingMember: null })}>
              Cancel
            </Button>
            <Button type="primary" disabled={sendModal.members.length === 0} onClick={handleSendAssessment}>
              Create assessment
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Neighbourhood */}
          <div>
            <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, color: '#8c8c8c', display: 'block', marginBottom: 4 }}>
              Neighbourhood
            </Text>
            <Text strong style={{ fontSize: 14 }}>{sendModal.record?.name}</Text>
          </div>

          {/* Assessment template */}
          <div>
            <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, color: '#8c8c8c', display: 'block', marginBottom: 4 }}>
              Assessment template
            </Text>
            <Text strong style={{ fontSize: 14 }}>{sendModal.template}</Text>
          </div>

          <Divider style={{ margin: 0 }} />

          {/* Add team member */}
          <div>
            <Text style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>Add team members</Text>
            <div style={{ display: 'flex', gap: 8 }}>
              <Select
                placeholder="Select a team member"
                style={{ flex: 1 }}
                value={sendModal.addingMember}
                onChange={(val) => setSendModal(prev => ({ ...prev, addingMember: val }))}
              >
                {SAMPLE_TEAM
                  .filter(m => !sendModal.members.find(sm => sm.id === m.id))
                  .map(m => <Select.Option key={m.id} value={m.id}>{m.name} — {m.role}</Select.Option>)
                }
              </Select>
              <Button
                disabled={!sendModal.addingMember}
                onClick={() => {
                  const member = SAMPLE_TEAM.find(m => m.id === sendModal.addingMember)
                  if (member) setSendModal(prev => ({ ...prev, members: [...prev.members, member], addingMember: null }))
                }}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Team members list */}
          <div>
            <Text strong style={{ fontSize: 14 }}>
              Team members with access ({sendModal.members.length})
            </Text>
            <div style={{ marginTop: 10 }}>
              {sendModal.members.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: 6 }}>
                  <UserOutlined style={{ fontSize: 22, color: '#bfbfbf' }} />
                  <Text type="secondary" style={{ fontSize: 13 }}>No team members yet — add some above</Text>
                </div>
              )}
              {sendModal.members.map((m, i) => {
                const ini = m.name.split(' ').map(n => n[0]).join('').toUpperCase()
                return (
                  <div key={m.id}>
                    {i > 0 && <Divider style={{ margin: 0 }} />}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
                      <Avatar size={32} style={{ background: '#4F46E5', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{ini}</Avatar>
                      <Text style={{ flex: 1, fontSize: 13 }}>{m.name}</Text>
                      <DeleteOutlined
                        style={{ color: hoveredMember === m.id ? '#ff4d4f' : '#8c8c8c', fontSize: 15, cursor: 'pointer', transition: 'color 0.15s' }}
                        onMouseEnter={() => setHoveredMember(m.id)}
                        onMouseLeave={() => setHoveredMember(null)}
                        onClick={() => setSendModal(prev => ({ ...prev, members: prev.members.filter(x => x.id !== m.id) }))}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </Drawer>

      {/* ── Respondent detail drawer ── */}
      {(() => {
        const a = respondentDrawer.assessment
        const details = a?.respondents?.details ?? []
        return (
          <Drawer
            title={
              <Space size={10}>
                <span>{a?.neighbourhood}</span>
                {a && <StatusPill statusMap={A_STATUS} value={a.status} />}
              </Space>
            }
            open={respondentDrawer.open}
            onClose={() => setRespondentDrawer({ open: false, assessment: null })}
            width={420}
            destroyOnHidden
          >
            <Space orientation="vertical" size={0} style={{ width: '100%' }}>
              {details.map((r, i) => {
                const initials = r.name.split(' ').map(n => n[0]).join('').toUpperCase()
                const cfg = A_STATUS[r.status] ?? A_STATUS['Not Started']
                return (
                  <div key={r.id}>
                    {i > 0 && <Divider style={{ margin: 0 }} />}
                    <div style={{ padding: '14px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                        <Avatar size={36} style={{ background: '#4F46E5', fontWeight: 600, fontSize: 13, flexShrink: 0 }}>
                          {initials}
                        </Avatar>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Text strong style={{ fontSize: 13, display: 'block' }}>{r.name}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>{r.role}</Text>
                        </div>
                        <StatusPill statusMap={A_STATUS} value={r.status} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Progress
                          percent={r.progress}
                          showInfo={false}
                          size="small"
                          strokeColor={cfg.color}
                          railColor="#f0f0f0"
                          style={{ flex: 1, margin: 0 }}
                        />
                        <Text style={{ fontSize: 12, fontWeight: 500, color: cfg.color, flexShrink: 0, width: 32, textAlign: 'right' }}>
                          {r.progress}%
                        </Text>
                      </div>
                    </div>
                  </div>
                )
              })}
            </Space>
          </Drawer>
        )
      })()}

      {/* ── Edit care home details drawer ── */}
      <Drawer
        title="Edit care home details"
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        width={480}
        destroyOnHidden
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setEditDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={saveDetails}>Save</Button>
          </div>
        }
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Care Home Name"
            rules={[{ required: true, message: 'Name is required.' }]}
            style={{ marginBottom: 16 }}>
            <Input placeholder="Care home name" />
          </Form.Item>
          <Form.Item name="beds" label="Total Beds"
            rules={[{ required: true, message: 'Beds is required.' }]}
            style={{ marginBottom: 0 }}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="Number of beds" />
          </Form.Item>

          <Divider style={{ margin: '20px 0' }} />

          <Form.Item name="address1" label="Address Line 1" style={{ marginBottom: 16 }}>
            <Input placeholder="Street address" />
          </Form.Item>
          <Form.Item name="address2" label="Address Line 2" style={{ marginBottom: 16 }}>
            <Input placeholder="Unit, suite, etc. (optional)" />
          </Form.Item>
          <Form.Item name="country" label="Country" style={{ marginBottom: 16 }}>
            <Select options={[{ value: 'Canada', label: 'Canada' }, { value: 'United States', label: 'United States' }]} />
          </Form.Item>
          <Form.Item name="province" label="Province / State" style={{ marginBottom: 16 }}>
            <Input placeholder="e.g. British Columbia" />
          </Form.Item>
          <Form.Item name="postalCode" label="Postal Code" style={{ marginBottom: 0 }}>
            <Input placeholder="e.g. V6A 1P1" />
          </Form.Item>
        </Form>
      </Drawer>

    </div>
  )
}

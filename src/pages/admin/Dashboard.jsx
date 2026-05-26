import { useState } from 'react'
import { Layout, Table, Button, Input, Typography, Space } from 'antd'
import {
  PlusOutlined, EditOutlined, FolderOpenOutlined, SearchOutlined,
} from '@ant-design/icons'

const { Content } = Layout
const { Title, Text } = Typography

const STATUS_OPTIONS = [
  { value: 'Lead',           bg: '#fffbe6', color: '#d46b08', dot: '#ffd591' },
  { value: 'Not Started',    bg: '#f5f5f5', color: '#595959', dot: '#bfbfbf' },
  { value: 'In Progress',    bg: '#fff7e6', color: '#d46b08', dot: '#faad14' },
  { value: 'Early Adoption', bg: '#e6f4ff', color: '#0958d9', dot: '#4096ff' },
  { value: 'Embedded',       bg: '#f6ffed', color: '#389e0d', dot: '#52c41a' },
]

const StatusPill = ({ status }) => {
  const opt = STATUS_OPTIONS.find(o => o.value === status) ?? STATUS_OPTIONS[1]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: opt.bg, color: opt.color,
      border: `1px solid ${opt.color}44`,
      borderRadius: 100, padding: '3px 10px',
      fontSize: 13, fontWeight: 600,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: opt.dot, flexShrink: 0 }} />
      {status}
    </span>
  )
}

const BedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', marginBottom: 1 }}>
    <path d="M3 10V7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3" stroke="#8c8c8c" strokeWidth="1.8" strokeLinecap="round"/>
    <rect x="2" y="10" width="20" height="7" rx="2" stroke="#8c8c8c" strokeWidth="1.8"/>
    <path d="M2 17v3M22 17v3" stroke="#8c8c8c" strokeWidth="1.8" strokeLinecap="round"/>
    <rect x="7" y="10" width="4" height="4" rx="1" fill="#8c8c8c" opacity="0.4"/>
    <rect x="13" y="10" width="4" height="4" rx="1" fill="#8c8c8c" opacity="0.4"/>
  </svg>
)

const careHomes = [
  {
    key: '1',
    name: 'Allday Care Home',
    contact: 'Olivia Davis',
    location: 'Vancouver, BC',
    address: '247 Hastings Street East, Vancouver, BC V6A 1P1',
    beds: 100,
    status: 'In Progress',
    homeLeader: { name: 'Olivia Davis', title: 'Director of Care', phone: '+1 (604) 555-0147', email: 'olivia.davis@alldaycare.ca' },
    teamMemberCount: 4,
  },
  { key: '2', name: '{Care home name}', contact: '{Principal contact}', location: '{City}, {Province}', address: '{Address}', beds: 100, status: 'Not Started', homeLeader: null, teamMemberCount: 0 },
  { key: '3', name: '{Care home name}', contact: '{Principal contact}', location: '{City}, {Province}', address: '{Address}', beds: 100, status: 'Not Started', homeLeader: null, teamMemberCount: 0 },
  { key: '4', name: '{Care home name}', contact: '{Principal contact}', location: '{City}, {Province}', address: '{Address}', beds: 100, status: 'Not Started', homeLeader: null, teamMemberCount: 0 },
  { key: '5', name: '{Care home name}', contact: '{Principal contact}', location: '{City}, {Province}', address: '{Address}', beds: 100, status: 'Not Started', homeLeader: null, teamMemberCount: 0 },
]

const columns = [
  {
    title: 'Care Home',
    dataIndex: 'name',
    key: 'name',
    render: (name, record) => (
      <Space orientation="vertical" size={0}>
        <Text strong>{name}</Text>
        <Text type="secondary" style={{ fontSize: 13 }}>{record.contact}</Text>
      </Space>
    ),
  },
  { title: 'Location', dataIndex: 'location', key: 'location' },
  {
    title: 'Beds', dataIndex: 'beds', key: 'beds', width: 80,
    render: (beds) => (
      <Space size={5}>
        <BedIcon />
        <Text>{beds}</Text>
      </Space>
    ),
  },
  {
    title: 'Implementation Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => <StatusPill status={status} />,
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Button size="small" onClick={() => record._onView?.(record)}>See Care Home</Button>
    ),
  },
]

const quickActions = [
  { key: 'add', icon: <PlusOutlined style={{ fontSize: 20 }} />, label: 'Add a new Care Home' },
  { key: 'templates', icon: <EditOutlined style={{ fontSize: 20 }} />, label: 'Edit Assessment template' },
  { key: 'library', icon: <FolderOpenOutlined style={{ fontSize: 20 }} />, label: 'Manage Content Library' },
]

export default function Dashboard({ onNavigate, onViewCareHome }) {
  const [search, setSearch] = useState('')

  const filtered = careHomes
    .filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.contact.toLowerCase().includes(search.toLowerCase())
    )
    .map((r) => ({ ...r, _onView: onViewCareHome }))

  return (
    <Layout style={{ background: '#f5f5f5' }}>
      {/* Hero */}
      <div style={{ background: '#64748b', padding: '32px 40px 28px' }}>
        <Title level={2} style={{ color: '#fff', margin: 0 }}>Hello Kim</Title>
        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15 }}>
          How will we help Care Homes adopt H4U today?
        </Text>
        <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
          {quickActions.map((a) => (
            <Button
              key={a.key}
              style={{
                height: 'auto',
                padding: '14px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#fff',
                border: '1px solid #d9d9d9',
                borderRadius: 8,
                flex: 1,
                justifyContent: 'flex-start',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}
              onClick={() => a.key !== 'add' && onNavigate?.(a.key)}
            >
              <span style={{ color: '#64748b' }}>{a.icon}</span>
              <Text strong style={{ fontSize: 15 }}>{a.label}</Text>
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Content style={{ padding: '32px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Title level={4} style={{ margin: 0 }}>Care Homes</Title>
          <Input
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="Search by Care Home or Leader"
            style={{ width: 300 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Table dataSource={filtered} columns={columns} pagination={false} bordered size="middle" />
      </Content>
    </Layout>
  )
}

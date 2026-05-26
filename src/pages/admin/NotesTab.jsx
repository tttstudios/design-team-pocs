import { useState } from 'react'
import {
  Card, Button, Space, Typography, Avatar, Input, Form,
  Checkbox, message, Popconfirm, Drawer,
} from 'antd'
import {
  EditOutlined, DeleteOutlined, UserOutlined,
  PhoneOutlined, MailOutlined, PlusOutlined,
} from '@ant-design/icons'

const { Text } = Typography
const { TextArea } = Input

const SAMPLE_NOTE =
  'Amanda visited on March 12. Home is well-run with strong leadership buy-in. Key opportunity areas: documentation practices and staff communication cadence. Olivia is engaged and motivated. Follow-up scheduled for May.'

// ── Shared contact view ──────────────────────────────────────────────────────

function ContactView({ person }) {
  if (!person) return null
  const initials = person.name?.split(' ').map((n) => n[0]).join('').toUpperCase() ?? '?'
  return (
    <div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
        <Avatar size={44} style={{ background: '#4F46E5', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
          {initials}
        </Avatar>
        <div>
          <Text strong style={{ fontSize: 15, display: 'block', lineHeight: 1.4 }}>{person.name}</Text>
          {person.title && <Text type="secondary" style={{ fontSize: 13 }}>{person.title}</Text>}
        </div>
      </div>
      <Space orientation="vertical" size={6}>
        {person.phone && (
          <Space size={8}>
            <PhoneOutlined style={{ color: '#8c8c8c', fontSize: 13 }} />
            <Text style={{ fontSize: 13 }}>{person.phone}</Text>
          </Space>
        )}
        {person.email && (
          <Space size={8}>
            <MailOutlined style={{ color: '#8c8c8c', fontSize: 13 }} />
            <Text style={{ fontSize: 13 }}>{person.email}</Text>
          </Space>
        )}
      </Space>
    </div>
  )
}

// ── Contact form fields (no buttons — footer lives in Drawer) ────────────────

function ContactFields({ form, showSameAsLeader, homeLeader }) {
  const sameAsLeader = Form.useWatch('sameAsLeader', form)

  return (
    <Form form={form} layout="vertical">
      {showSameAsLeader && (
        <Form.Item name="sameAsLeader" valuePropName="checked" style={{ marginBottom: 20 }}>
          <Checkbox>
            Same as Home Leader
            {homeLeader && (
              <Text type="secondary" style={{ fontSize: 12, marginLeft: 6 }}>
                ({homeLeader.name})
              </Text>
            )}
          </Checkbox>
        </Form.Item>
      )}

      {showSameAsLeader && sameAsLeader && homeLeader && (
        <div style={{
          background: '#f9fafb', border: '1px solid #e5e7eb',
          borderRadius: 8, padding: '12px 14px', marginBottom: 20,
        }}>
          <ContactView person={homeLeader} />
        </div>
      )}

      {!sameAsLeader && (
        <>
          <Form.Item
            name="name" label="Full Name"
            rules={[{ required: true, message: 'Full name is required.' }]}
            style={{ marginBottom: 12 }}
          >
            <Input placeholder="Full name" />
          </Form.Item>
          <Form.Item name="title" label="Job Title" style={{ marginBottom: 12 }}>
            <Input placeholder="Job title" />
          </Form.Item>
          <Form.Item name="phone" label="Phone" style={{ marginBottom: 12 }}>
            <Input placeholder="Phone number" />
          </Form.Item>
          <Form.Item
            name="email" label="Email"
            rules={[{ type: 'email', message: 'Enter a valid email address.' }]}
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="Email address" />
          </Form.Item>
        </>
      )}
    </Form>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function NotesTab({ careHome }) {
  const homeLeader = careHome?.homeLeader ?? null
  const [messageApi, ctx] = message.useMessage()

  // ── Notes ──
  const [noteText, setNoteText]       = useState(SAMPLE_NOTE)
  const [noteDraft, setNoteDraft]     = useState('')
  const [noteEditing, setNoteEditing] = useState(false)
  const [noteUpdatedAt, setNoteUpdatedAt] = useState(new Date(2026, 2, 12, 14, 32))

  const openNoteEdit  = () => { setNoteDraft(noteText); setNoteEditing(true) }
  const cancelNoteEdit = () => setNoteEditing(false)
  const saveNote = () => {
    try {
      setNoteText(noteDraft)
      setNoteUpdatedAt(new Date())
      setNoteEditing(false)
      messageApi.success('Notes have been updated.')
    } catch {
      messageApi.error('Something went wrong. Please try again.')
    }
  }

  // ── Executive Sponsor ──
  const [sponsor, setSponsor]               = useState({ sameAsLeader: true })
  const [sponsorDrawerOpen, setSponsorDrawerOpen] = useState(false)
  const [sponsorForm] = Form.useForm()

  const openSponsorDrawer  = () => setSponsorDrawerOpen(true)
  const closeSponsorDrawer = () => setSponsorDrawerOpen(false)

  const saveSponsor = () => {
    sponsorForm
      .validateFields()
      .then((values) => {
        const prev = sponsor
        try {
          setSponsor(
            values.sameAsLeader
              ? { sameAsLeader: true }
              : { sameAsLeader: false, name: values.name, title: values.title, phone: values.phone, email: values.email }
          )
          setSponsorDrawerOpen(false)
          messageApi.success('Executive Sponsor updated.')
        } catch {
          setSponsor(prev)
          messageApi.error('Something went wrong. Please try again.')
        }
      })
      .catch(() => {})
  }

  const sponsorInitialValues = {
    sameAsLeader: sponsor.sameAsLeader,
    name:  sponsor.sameAsLeader ? '' : (sponsor.name  ?? ''),
    title: sponsor.sameAsLeader ? '' : (sponsor.title ?? ''),
    phone: sponsor.sameAsLeader ? '' : (sponsor.phone ?? ''),
    email: sponsor.sameAsLeader ? '' : (sponsor.email ?? ''),
  }

  const resolvedSponsor = sponsor.sameAsLeader ? homeLeader : sponsor

  // ── Executive Assistant ──
  const [assistant, setAssistant]     = useState(null)
  const [assistantMode, setAssistantMode] = useState(null) // 'add' | 'edit'
  const [assistantForm] = Form.useForm()

  const openAddAssistant  = () => setAssistantMode('add')
  const openEditAssistant = () => setAssistantMode('edit')
  const closeAssistantDrawer = () => setAssistantMode(null)

  const saveAssistant = () => {
    assistantForm
      .validateFields()
      .then((values) => {
        const prev = assistant
        const isAdd = assistantMode === 'add'
        try {
          setAssistant({ name: values.name, title: values.title, phone: values.phone, email: values.email })
          setAssistantMode(null)
          messageApi.success(isAdd ? 'Executive Assistant added.' : 'Executive Assistant updated.')
        } catch {
          setAssistant(prev)
          messageApi.error('Something went wrong. Please try again.')
        }
      })
      .catch(() => {})
  }

  const removeAssistant = () => {
    try {
      setAssistant(null)
      messageApi.success('Executive Assistant removed.')
    } catch {
      messageApi.error('Something went wrong. Please try again.')
    }
  }

  const formatTs = (date) =>
    date
      ? date.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' }) +
        ' at ' +
        date.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })
      : null

  const drawerFooter = (onCancel, onSave) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      <Button onClick={onCancel}>Cancel</Button>
      <Button type="primary" onClick={onSave}>Save</Button>
    </div>
  )

  // ── Render ──

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      {ctx}

      {/* ── Notes column ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
      <Card
        title={<Text strong>Notes</Text>}
        extra={noteEditing ? (
          <Space size={8}>
            <Button size="small" onClick={cancelNoteEdit}>Cancel</Button>
            <Button size="small" type="primary" onClick={saveNote}>Save</Button>
          </Space>
        ) : (
          <Button type="text" size="small" icon={<EditOutlined />} onClick={openNoteEdit}>Edit</Button>
        )}
        style={{ borderRadius: 10, marginBottom: 16 }}
      >
        {noteEditing ? (
          <TextArea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            autoSize={{ minRows: 5, maxRows: 14 }}
            placeholder="Add notes about this care home…"
          />
        ) : (
          <Space orientation="vertical" style={{ width: '100%' }} size={10}>
            {noteText ? (
              <Text style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{noteText}</Text>
            ) : (
              <Text type="secondary" style={{ fontStyle: 'italic' }}>No notes yet.</Text>
            )}
            {noteUpdatedAt && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Last updated {formatTs(noteUpdatedAt)}
              </Text>
            )}
          </Space>
        )}
      </Card>
      </div>

      {/* ── Key Contacts column ── */}
      <div style={{ width: 320, flexShrink: 0 }}>
        <Card
          title={<Text strong>Key Contacts</Text>}
          style={{ borderRadius: 10 }}
        >
          {/* Executive Sponsor section */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 500 }}>
                Executive Sponsor
              </Text>
              <Button type="text" size="small" icon={<EditOutlined />} onClick={openSponsorDrawer}>Edit</Button>
            </div>
            {sponsor.sameAsLeader ? (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#f0f5ff', color: '#2f54eb', borderRadius: 100,
                padding: '2px 10px', fontSize: 12, fontWeight: 500,
              }}>
                <UserOutlined style={{ fontSize: 11 }} />
                Same as Home Leader
              </span>
            ) : (
              resolvedSponsor
                ? <ContactView person={resolvedSponsor} />
                : <Text type="secondary">No sponsor assigned.</Text>
            )}
          </div>

          <div style={{ borderTop: '1px solid #f0f0f0', marginBottom: 20 }} />

          {/* Executive Assistant section */}
          <div>
            {assistant && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 500 }}>
                  Executive Assistant
                </Text>
                <Space size={4}>
                  <Button type="text" size="small" icon={<EditOutlined />} onClick={openEditAssistant}>Edit</Button>
                  <Popconfirm
                    title="Remove Executive Assistant?"
                    description="This will clear the Executive Assistant slot."
                    okText="Remove" okType="danger" cancelText="Cancel"
                    onConfirm={removeAssistant}
                  >
                    <Button type="text" size="small" danger icon={<DeleteOutlined />}>Remove</Button>
                  </Popconfirm>
                </Space>
              </div>
            )}
            {assistant ? (
              <ContactView person={assistant} />
            ) : (
              <Button size="small" icon={<PlusOutlined />} onClick={openAddAssistant}>
                Add Executive Assistant
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* ── Executive Sponsor drawer ── */}
      <Drawer
        title="Edit Executive Sponsor"
        open={sponsorDrawerOpen}
        onClose={closeSponsorDrawer}
        width={480}
        destroyOnHidden
        footer={drawerFooter(closeSponsorDrawer, saveSponsor)}
      >
        <ContactFields
          form={sponsorForm}
          showSameAsLeader
          homeLeader={homeLeader}
          initialValues={sponsorInitialValues}
        />
      </Drawer>

      {/* ── Executive Assistant drawer ── */}
      <Drawer
        title={assistantMode === 'add' ? 'Add Executive Assistant' : 'Edit Executive Assistant'}
        open={!!assistantMode}
        onClose={closeAssistantDrawer}
        width={480}
        destroyOnHidden
        footer={drawerFooter(closeAssistantDrawer, saveAssistant)}
      >
        <ContactFields
          form={assistantForm}
          showSameAsLeader={false}
          homeLeader={null}
          initialValues={assistantMode === 'edit' ? assistant : {}}
        />
      </Drawer>
    </div>
  )
}

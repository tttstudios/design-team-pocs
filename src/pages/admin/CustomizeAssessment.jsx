import { useState, useMemo } from 'react'
import { Button, Switch, Typography, Space, Modal, Drawer, Radio, message } from 'antd'
import { ArrowLeftOutlined, CaretRightFilled, ExclamationCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

// ── Template data ─────────────────────────────────────────────────────────────

const DOMAINS = [
  {
    id: 'd1', name: 'Choice and Flexibility',
    questions: [
      { id: 'd1q1', text: 'Residents are supported to participate in their care planning' },
      { id: 'd1q2', text: 'Residents can choose to have family members involved in their care planning' },
    ],
  },
  {
    id: 'd2', name: 'Meals',
    questions: [
      { id: 'd2q1',  text: 'Staff facilitate conversations between residents and team members during meal times' },
      { id: 'd2q2',  text: 'Residents and/or family members are invited to assist in preparing meals and snacks' },
      { id: 'd2q3',  text: 'Residents are able to choose menu items that suit their preferences' },
      { id: 'd2q4',  text: 'Residents choose what, when, how much, and how frequently they eat' },
      { id: 'd2q5',  text: 'Enable residents to participate at each stage of the dining experience at their interest and ability level with the time and support needed (e.g. setting the table, preparing food, serving and feeding themselves, etc)' },
      { id: 'd2q6',  text: 'Residents are offered a variety of nutritious, tasty, and diverse meals that they like to eat and align with their dietary needs' },
      { id: 'd2q7',  text: 'Residents are offered menu options that align with their cultural and religious preferences' },
      { id: 'd2q8',  text: 'Household kitchens are stocked with communal food and equipment items used for meals and snacks' },
      { id: 'd2q9',  text: 'Residents have access to personal food stored in a secure location' },
      { id: 'd2q10', text: 'A communal dining experience, where food is served at the table and residents can choose to eat together with staff and families/guests is facilitated' },
      { id: 'd2q11', text: "Resident's preferences to eat where and with whom they wish, including eating alone, are supported" },
      { id: 'd2q12', text: 'Residents are encouraged to participate in meal and/or snack preparation' },
      { id: 'd2q13', text: 'Staff are able to modify meals based on existing conditions such as dysphagia' },
    ],
  },
  {
    id: 'd3', name: 'Personal Hygiene',
    questions: [
      { id: 'd3q1', text: 'Residents can select when they would like to bathe/shower' },
      { id: 'd3q2', text: 'Residents can select how they would like to bathe (i.e. bath vs shower)' },
      { id: 'd3q3', text: 'Family members can assist with bathing/showering if resident requests' },
      { id: 'd3q4', text: 'Residents are enabled to wash themselves at their interest and ability level with the time and support needed' },
      { id: 'd3q5', text: 'Residents bathe with dignity, respect and utmost privacy' },
      { id: 'd3q6', text: "Residents preferences regarding sensory needs (noise, lighting, temperature) are incorporated during bathing" },
      { id: 'd3q7', text: 'Residents are supported to complete their grooming in accordance with their wishes and preferences' },
    ],
  },
  {
    id: 'd4', name: 'Household Hygiene',
    questions: [
      { id: 'd4q1', text: "Residents and/or family members can assist with washing residents' personal laundry if desired" },
      { id: 'd4q2', text: 'Residents are supported to complete household chores at their interest and ability level with the time and support needed' },
      { id: 'd4q3', text: 'Residents choose where personal items are stored in their room' },
      { id: 'd4q4', text: 'A home-like environment is maintained where residents, staff, and families/guests are able to safely move through the space' },
      { id: 'd4q5', text: 'Residents and staff work together to inform aspects of a cleaning and laundry schedule for the household' },
    ],
  },
  {
    id: 'd5', name: 'Relationships',
    questions: [
      { id: 'd5q1', text: 'Residents are actively supported to form and maintain relationships with other members of their household and within the home' },
      { id: 'd5q2', text: 'Staff are supported and encouraged to engage in meaningful conversations with residents' },
      { id: 'd5q3', text: 'Staff know key personal details about residents (interests, routines, life history)' },
      { id: 'd5q4', text: 'Staff are supported with education to build emotional connections as part of their role' },
      { id: 'd5q5', text: 'Does the staffing model enable the same staff to work with the same residents in a particular neighborhood to enable continuity?' },
    ],
  },
  {
    id: 'd6', name: 'Hobbies and Leisure',
    questions: [
      { id: 'd6q1', text: 'Residents choose when and how they spend time with other people' },
      { id: 'd6q2', text: 'Staff support residents with the time, space, and equipment needed to spend their time as they choose' },
      { id: 'd6q3', text: 'Residents are supported to participate in their desired activities in the wider community outside the home' },
      { id: 'd6q4', text: 'Residents choose what activities they participate in and when they do so' },
      { id: 'd6q5', text: 'Residents are supported with individualized activity plans that align with their needs, preferences and abilities' },
      { id: 'd6q6', text: 'Residents are informed of available activities and assisted to choose the ones of interest to them' },
      { id: 'd6q7', text: 'Residents who require isolation precautions are supported to still engage in their chosen activities with the required modifications to maintain precautions, as needed' },
      { id: 'd6q8', text: "Staff facilitate residents' choice for where and how they move around the household, LTC home, and wider community outside the home" },
      { id: 'd6q9', text: "A variety of activities are offered throughout the day, structured and spontaneous, that reflect the interests of diverse residents and are modified as needed to meet the residents' needs" },
    ],
  },
  {
    id: 'd7', name: 'Community Life',
    questions: [
      { id: 'd7q1', text: "Resident's privacy and quiet time is respected" },
      { id: 'd7q2', text: 'There is a regular venue for the household community to discuss what is and is not working within the household' },
      { id: 'd7q3', text: 'Residents can choose when to wake up and go to bed' },
      { id: 'd7q4', text: 'Staff can adapt their workflow to resident preferences rather than fixed, task based schedules' },
      { id: 'd7q5', text: 'There are opportunities for intergenerational activities and interactions' },
      { id: 'd7q6', text: 'Families are welcomed as partners in care' },
      { id: 'd7q7', text: 'Residents are supported to practice their religious beliefs in alignment with their preferences' },
    ],
  },
  {
    id: 'd8', name: 'Accessibility and Dementia Design',
    questions: [
      { id: 'd8q1', text: 'Staff receive training in relational, autonomy‑focused, and dementia‑friendly approaches to care' },
      { id: 'd8q2', text: 'A variety of spaces and supplies are available and accessible for residents to participate in their preferred activity' },
      { id: 'd8q3', text: 'The home provides space and opportunity for residents to enjoy places tailored to their sensory needs' },
      { id: 'd8q4', text: 'Wayfinding is accessible throughout the home with visual cues such as markers, signage and colour contrast' },
    ],
  },
  {
    id: 'd9', name: 'Physical Environment',
    questions: [
      { id: 'd9q1', text: "The home's decor, lighting and spaces create a home-like environment" },
      { id: 'd9q2', text: 'Personal belongings and customization according to resident preferences is encouraged in communal areas' },
      { id: 'd9q3', text: 'The home operates in small resident households/groupings' },
      { id: 'd9q4', text: 'Each household has a shared kitchen and living area' },
      { id: 'd9q5', text: 'The home has a grocery store or retail outlet for residents to visit and use' },
      { id: 'd9q6', text: 'Residents have year round access to safe outdoor spaces' },
    ],
  },
  {
    id: 'd10', name: 'Operations',
    questions: [
      { id: 'd10q1',  text: 'The staffing model for the home supports consistent staff-resident relationships' },
      { id: 'd10q2',  text: 'Job descriptions reflect staff autonomy to adapt daily schedules according to resident preferences' },
      { id: 'd10q3',  text: 'Staff schedules maximize continuity within the same households and/or resident groups' },
      { id: 'd10q4',  text: 'Staff roles support resident autonomy and participation in daily life activities (e.g. flexible duties, multiservice workers)' },
      { id: 'd10q5',  text: 'Staffing levels are sufficient to allow residents to direct their daily routines' },
      { id: 'd10q6',  text: "The home's daily workflows are adaptable to encourage resident directed care" },
      { id: 'd10q7',  text: 'Teams are empowered to adjust routines in the moment based on resident preferences' },
      { id: 'd10q8',  text: 'Household teams have established communication to coordinate relational care and plan for resident preferences' },
      { id: 'd10q9',  text: 'Staff onboarding processes reinforce values such as autonomy and emotional connection' },
      { id: 'd10q10', text: 'The home has operational processes to support resident involvement in household activities such as baking, gardening and laundry' },
    ],
  },
  {
    id: 'd11', name: 'Building Design/Procurement',
    questions: [
      { id: 'd11q1',  text: 'The physical building of the home reflects dementia friendly design features' },
      { id: 'd11q2',  text: 'Lighting systems are designed to reflect time of day and can be adjusted' },
      { id: 'd11q3',  text: 'Temperature controls can be adjusted according to resident and neighborhood preferences' },
      { id: 'd11q4',  text: 'Technology such as real-time location services is integrated in workflows to promote resident safety and autonomy' },
      { id: 'd11q5',  text: 'The home is involved in partnerships with community businesses, such as a restaurant, grocery store or day care' },
      { id: 'd11q6',  text: 'Each resident has their own private room with ensuite bathroom' },
      { id: 'd11q7',  text: 'Resident rooms have ample natural light via windows' },
      { id: 'd11q8',  text: 'Residents have access to safe outdoor spaces and can enjoy the outdoors according to their needs and preferences' },
      { id: 'd11q9',  text: 'Residents have access and support to garden (i.e. raised garden beds)' },
      { id: 'd11q10', text: 'There are accessible outdoor seating areas with shade structures to support resident and family enjoyment of the outdoors' },
    ],
  },
  {
    id: 'd12', name: 'Measurement and Outcomes',
    questions: [
      { id: 'd12q1', text: 'The following are tracked, measured and reported on as part of ongoing evaluation, and used to plan improvements: resident satisfaction and feedback, family/loved one satisfaction and feedback, staff satisfaction, staff retention and turnover, and health outcome indicators' },
      { id: 'd12q2', text: 'Data is shared with residents, families and staff with opportunity to discuss, set goals and problem solve' },
      { id: 'd12q3', text: 'Qualitative feedback related to resident and family experience is collected and used to inform planning' },
    ],
  },
]

const TEMPLATES = [
  {
    id: 'existing',
    name: 'Existing Care Home',
    description: 'For homes already familiar with H4U practices. Focuses on adoption depth and areas for refinement.',
    domains: DOMAINS,
  },
  {
    id: 'new',
    name: 'New Care Home',
    description: 'For homes beginning their H4U journey. Covers foundational practices and initial readiness.',
    domains: DOMAINS,
  },
]

function buildDefaultState(template) {
  return {
    domainEnabled:    Object.fromEntries(template.domains.map(d => [d.id, true])),
    questionEnabled:  Object.fromEntries(template.domains.flatMap(d => d.questions.map(q => [q.id, true]))),
  }
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CustomizeAssessment({ careHome, initialTemplateId = 'existing', onBack }) {
  const [messageApi, ctx] = message.useMessage()

  // Template
  const [activeTemplateId, setActiveTemplateId] = useState(initialTemplateId)
  const [savedTemplateId,  setSavedTemplateId]  = useState(initialTemplateId)

  const activeTemplate = TEMPLATES.find(t => t.id === activeTemplateId) ?? TEMPLATES[0]

  // Toggle states
  const init = buildDefaultState(activeTemplate)
  const [domainEnabled,       setDomainEnabled]       = useState(init.domainEnabled)
  const [questionEnabled,     setQuestionEnabled]      = useState(init.questionEnabled)
  const [savedDomainEnabled,  setSavedDomainEnabled]   = useState(init.domainEnabled)
  const [savedQuestionEnabled, setSavedQuestionEnabled] = useState(init.questionEnabled)

  // UI state
  const [expandedDomains,    setExpandedDomains]   = useState(() => new Set(activeTemplate.domains.map(d => d.id)))
  const [changeApproachOpen, setChangeApproachOpen] = useState(false)
  const [pendingTemplateId,  setPendingTemplateId]  = useState(initialTemplateId)
  const [saveModalOpen,      setSaveModalOpen]      = useState(false)

  // ── Dirty check ──
  const isDirty = useMemo(() => {
    if (activeTemplateId !== savedTemplateId) return true
    for (const key of Object.keys(domainEnabled)) {
      if (domainEnabled[key] !== (savedDomainEnabled[key] ?? true)) return true
    }
    for (const key of Object.keys(questionEnabled)) {
      if (questionEnabled[key] !== (savedQuestionEnabled[key] ?? true)) return true
    }
    return false
  }, [activeTemplateId, savedTemplateId, domainEnabled, questionEnabled, savedDomainEnabled, savedQuestionEnabled])

  // ── Stats ──
  const stats = useMemo(() => {
    const totalDomains    = activeTemplate.domains.length
    const activeDomains   = activeTemplate.domains.filter(d => domainEnabled[d.id]).length
    const totalQuestions  = activeTemplate.domains.flatMap(d => d.questions).length
    const activeQuestions = activeTemplate.domains
      .filter(d => domainEnabled[d.id])
      .flatMap(d => d.questions)
      .filter(q => questionEnabled[q.id]).length
    return { totalDomains, activeDomains, totalQuestions, activeQuestions }
  }, [activeTemplate, domainEnabled, questionEnabled])

  // ── Actions ──
  const handleBack = () => {
    if (isDirty) {
      Modal.confirm({
        title: 'You have unsaved changes',
        content: 'Your changes will be lost if you leave.',
        okText: 'Leave anyway', okType: 'danger',
        cancelText: 'Stay',
        onOk: onBack,
      })
    } else {
      onBack()
    }
  }

  const confirmSave = () => {
    setSavedTemplateId(activeTemplateId)
    setSavedDomainEnabled({ ...domainEnabled })
    setSavedQuestionEnabled({ ...questionEnabled })
    setSaveModalOpen(false)
    messageApi.success('Changes saved.')
  }

  const openChangeApproach = () => {
    setPendingTemplateId(activeTemplateId)
    setChangeApproachOpen(true)
  }

  const closeChangeApproach = () => {
    setChangeApproachOpen(false)
    setPendingTemplateId(activeTemplateId)
  }

  const applyTemplate = () => {
    const newTemplate = TEMPLATES.find(t => t.id === pendingTemplateId) ?? TEMPLATES[0]
    const newState    = buildDefaultState(newTemplate)
    setActiveTemplateId(pendingTemplateId)
    setDomainEnabled(newState.domainEnabled)
    setQuestionEnabled(newState.questionEnabled)
    setExpandedDomains(new Set())
    setChangeApproachOpen(false)
  }

  const toggleDomain = (domainId, val) => {
    setDomainEnabled(prev => ({ ...prev, [domainId]: val }))
  }

  const toggleQuestion = (qId, val) => {
    setQuestionEnabled(prev => ({ ...prev, [qId]: val }))
  }

  const toggleExpand = (domainId) => {
    setExpandedDomains(prev => {
      const next = new Set(prev)
      if (next.has(domainId)) next.delete(domainId)
      else next.add(domainId)
      return next
    })
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100%' }}>
      {ctx}

      {/* Header */}
      <div style={{ background: '#fff', padding: '20px 40px 24px', borderBottom: '1px solid #f0f0f0' }}>
        <Button
          type="link" icon={<ArrowLeftOutlined />} onClick={handleBack}
          style={{ padding: 0, marginBottom: 16, color: '#8c8c8c', fontSize: 13 }}
        >
          {careHome.name}
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Title level={3} style={{ margin: '0 0 4px' }}>Customize Assessment</Title>
            <Space size={6}>
              <Text type="secondary" style={{ fontSize: 13 }}>{activeTemplate.name}</Text>
              <Text type="secondary" style={{ fontSize: 13 }}>·</Text>
              <Text style={{ fontSize: 13 }}>
                <Text strong style={{ fontSize: 13 }}>{stats.activeDomains}/{stats.totalDomains}</Text>
                <Text type="secondary" style={{ fontSize: 13 }}> domains</Text>
              </Text>
              <Text type="secondary" style={{ fontSize: 13 }}>·</Text>
              <Text style={{ fontSize: 13 }}>
                <Text strong style={{ fontSize: 13 }}>{stats.activeQuestions}/{stats.totalQuestions}</Text>
                <Text type="secondary" style={{ fontSize: 13 }}> questions</Text>
              </Text>
            </Space>
          </div>
          <Space size={8}>
            <Button onClick={openChangeApproach}>Change approach</Button>
            <Button type="primary" disabled={!isDirty} onClick={() => setSaveModalOpen(true)}>
              Save changes
            </Button>
          </Space>
        </div>
      </div>

      {/* Unsaved changes banner */}
      {isDirty && (
        <div style={{
          background: '#fffbe6', borderBottom: '1px solid #ffe58f',
          padding: '10px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Space size={8}>
            <ExclamationCircleOutlined style={{ color: '#d46b08' }} />
            <Text style={{ fontSize: 13, color: '#614700' }}>You have unsaved changes.</Text>
          </Space>
        </div>
      )}

      {/* Domain list */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {activeTemplate.domains.map(domain => {
            const enabled  = domainEnabled[domain.id] ?? true
            const expanded = expandedDomains.has(domain.id)
            const activeQs = domain.questions.filter(q => questionEnabled[q.id]).length
            const totalQs  = domain.questions.length

            return (
              <div
                key={domain.id}
                style={{
                  background: '#fff',
                  borderRadius: 10,
                  border: '1px solid #f0f0f0',
                  overflow: 'hidden',
                  opacity: enabled ? 1 : 0.5,
                  transition: 'opacity 0.2s',
                }}
              >
                {/* Domain header row */}
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px', cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  onClick={() => toggleExpand(domain.id)}
                >
                  <CaretRightFilled style={{
                    fontSize: 11, color: '#8c8c8c', flexShrink: 0,
                    transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.15s',
                  }} />
                  <Text strong style={{ flex: 1, fontSize: 14 }}>{domain.name}</Text>
                  <span style={{
                    background: enabled ? '#f0f5ff' : '#f5f5f5',
                    color: enabled ? '#2f54eb' : '#8c8c8c',
                    borderRadius: 100, padding: '2px 10px',
                    fontSize: 12, fontWeight: 500, marginRight: 8,
                    flexShrink: 0,
                  }}>
                    {activeQs}/{totalQs} questions
                  </span>
                  <div onClick={e => e.stopPropagation()}>
                    <Switch
                      size="small"
                      checked={enabled}
                      onChange={val => toggleDomain(domain.id, val)}
                    />
                  </div>
                </div>

                {/* Question rows */}
                {expanded && domain.questions.map(q => {
                  const qEnabled = questionEnabled[q.id] ?? true
                  return (
                    <div key={q.id}>
                      <div style={{ height: 1, background: '#f5f5f5', marginLeft: 40 }} />
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 16px 12px 40px',
                        opacity: qEnabled ? 1 : 0.5,
                        transition: 'opacity 0.15s',
                      }}>
                        <Text style={{ flex: 1, fontSize: 13 }}>{q.text}</Text>
                        <Switch
                          size="small"
                          checked={qEnabled}
                          disabled={!enabled}
                          onChange={val => toggleQuestion(q.id, val)}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* Save confirmation modal */}
      <Modal
        title="Save customization?"
        open={saveModalOpen}
        onOk={confirmSave}
        onCancel={() => setSaveModalOpen(false)}
        okText="Save changes"
        cancelText="Cancel"
      >
        <Text>
          This configuration will apply to all{' '}
          <Text strong>future assessments</Text> for {careHome.name}.
          Past assessments are not affected.
        </Text>
      </Modal>

      {/* Change approach drawer */}
      <Drawer
        title="Change assessment approach"
        open={changeApproachOpen}
        onClose={closeChangeApproach}
        width={480}
        destroyOnHidden
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={closeChangeApproach}>Cancel</Button>
            <Button
              type="primary"
              disabled={pendingTemplateId === activeTemplateId}
              onClick={applyTemplate}
            >
              Apply
            </Button>
          </div>
        }
      >
        <Radio.Group
          value={pendingTemplateId}
          onChange={e => setPendingTemplateId(e.target.value)}
          style={{ width: '100%' }}
        >
          <Space orientation="vertical" size={12} style={{ width: '100%' }}>
            {TEMPLATES.map(t => {
              const domainCount   = t.domains.length
              const questionCount = t.domains.reduce((sum, d) => sum + d.questions.length, 0)
              const isSelected    = pendingTemplateId === t.id
              return (
                <Radio
                  key={t.id}
                  value={t.id}
                  style={{
                    display: 'flex', alignItems: 'flex-start',
                    border: `1px solid ${isSelected ? '#4F46E5' : '#e5e7eb'}`,
                    borderRadius: 8, padding: '12px 14px', width: '100%',
                    background: isSelected ? '#f5f3ff' : '#fff',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  <div style={{ marginLeft: 8 }}>
                    <Text strong style={{ display: 'block', marginBottom: 2 }}>{t.name}</Text>
                    <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>
                      {t.description}
                    </Text>
                    <Space size={16}>
                      <Text type="secondary" style={{ fontSize: 12 }}>{domainCount} domains</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{questionCount} questions</Text>
                    </Space>
                  </div>
                </Radio>
              )
            })}
          </Space>
        </Radio.Group>

        {pendingTemplateId !== activeTemplateId && (
          <div style={{
            marginTop: 20, background: '#fffbe6',
            border: '1px solid #ffe58f', borderRadius: 8,
            padding: '12px 14px', display: 'flex', gap: 10,
          }}>
            <ExclamationCircleOutlined style={{ color: '#d46b08', marginTop: 2, flexShrink: 0 }} />
            <Text style={{ fontSize: 13, color: '#614700' }}>
              Switching templates will reset your current question selections for this home. This cannot be undone.
            </Text>
          </div>
        )}
      </Drawer>
    </div>
  )
}

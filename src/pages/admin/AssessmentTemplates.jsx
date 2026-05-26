import { useState, useMemo } from 'react'
import {
  Table, Button, Input, Select, Tag, Space, Typography,
  Modal, Drawer, Form, Switch, message, Card, Row, Col,
  Checkbox, Tooltip, Popover, Dropdown, Popconfirm,
} from 'antd'
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  ArrowLeftOutlined, CheckOutlined, CloseOutlined,
  SearchOutlined, InfoCircleOutlined, FilterOutlined,
  EllipsisOutlined, InboxOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography
const { TextArea } = Input

const DOMAINS = [
  'Choice and Flexibility',
  'Meals and Dining Experience',
  'Personal Hygiene',
  'Household Hygiene and Daily Living',
  'Relationships and Emotional Connection',
  'Hobbies, Leisure, and Meaningful Activity',
  'Community Life and Belonging',
  'Accessibility and Dementia-Friendly Design',
  'Physical Environment',
  'Operations and Workforce Practices',
  'Building Design, Technology, and Partnerships',
  'Measurement and Outcomes',
]

const DOMAIN_COLORS = {
  'Choice and Flexibility':                        'blue',
  'Meals and Dining Experience':                   'orange',
  'Personal Hygiene':                              'cyan',
  'Household Hygiene and Daily Living':            'green',
  'Relationships and Emotional Connection':        'purple',
  'Hobbies, Leisure, and Meaningful Activity':     'gold',
  'Community Life and Belonging':                  'geekblue',
  'Accessibility and Dementia-Friendly Design':    'volcano',
  'Physical Environment':                          'lime',
  'Operations and Workforce Practices':            'magenta',
  'Building Design, Technology, and Partnerships': 'red',
  'Measurement and Outcomes':                      'yellow',
}

const INIT_INDICATORS = [
  { id:  1, order:  1, domains: ['Choice and Flexibility'],                        text: 'Residents participate in care planning' },
  { id:  2, order:  2, domains: ['Choice and Flexibility'],                        text: 'Residents choose family involvement in care planning' },
  { id:  3, order:  3, domains: ['Choice and Flexibility'],                        text: 'Staff adapt routines based on resident preferences' },
  { id:  4, order:  4, domains: ['Meals and Dining Experience'],                   text: 'Residents choose what/when/how much/where they eat' },
  { id:  5, order:  5, domains: ['Meals and Dining Experience'],                   text: 'Residents participate in meal preparation' },
  { id:  6, order:  6, domains: ['Meals and Dining Experience'],                   text: 'Cultural, religious, dietary needs supported' },
  { id:  7, order:  7, domains: ['Meals and Dining Experience'],                   text: 'Mealtime pacing reflects preferences' },
  { id:  8, order:  8, domains: ['Meals and Dining Experience'],                   text: 'Communal dining available but not mandatory' },
  { id:  9, order:  9, domains: ['Personal Hygiene'],                              text: 'Residents choose when and how they bathe' },
  { id: 10, order: 10, domains: ['Personal Hygiene'],                              text: 'Sensory preferences respected' },
  { id: 11, order: 11, domains: ['Personal Hygiene'],                              text: 'Residents supported to do as much as they wish' },
  { id: 12, order: 12, domains: ['Personal Hygiene'],                              text: 'Grooming reflects personal/cultural preferences' },
  { id: 13, order: 13, domains: ['Household Hygiene and Daily Living'],            text: 'Residents/families can assist with laundry' },
  { id: 14, order: 14, domains: ['Household Hygiene and Daily Living'],            text: 'Residents participate in household chores' },
  { id: 15, order: 15, domains: ['Household Hygiene and Daily Living'],            text: 'Residents control personal item storage' },
  { id: 16, order: 16, domains: ['Household Hygiene and Daily Living'],            text: 'Cleaning/laundry schedules reflect resident input' },
  { id: 17, order: 17, domains: ['Relationships and Emotional Connection'],        text: 'Staff engage in meaningful conversations' },
  { id: 18, order: 18, domains: ['Relationships and Emotional Connection'],        text: "Staff know residents' life stories/routines" },
  { id: 19, order: 19, domains: ['Relationships and Emotional Connection'],        text: 'Staffing model supports continuity' },
  { id: 20, order: 20, domains: ['Relationships and Emotional Connection'],        text: 'Staff educated on relational care' },
  { id: 21, order: 21, domains: ['Hobbies, Leisure, and Meaningful Activity'],     text: 'Residents choose activities and timing' },
  { id: 22, order: 22, domains: ['Hobbies, Leisure, and Meaningful Activity'],     text: 'Structured and spontaneous options available' },
  { id: 23, order: 23, domains: ['Hobbies, Leisure, and Meaningful Activity'],     text: 'Isolated residents still engage meaningfully' },
  { id: 24, order: 24, domains: ['Community Life and Belonging'],                  text: 'Residents choose sleep/wake times' },
  { id: 25, order: 25, domains: ['Community Life and Belonging'],                  text: 'Families welcomed as partners in care' },
  { id: 26, order: 26, domains: ['Community Life and Belonging'],                  text: 'Intergenerational interaction opportunities' },
  { id: 27, order: 27, domains: ['Community Life and Belonging'],                  text: 'Residents practice spiritual/religious beliefs' },
  { id: 28, order: 28, domains: ['Community Life and Belonging'],                  text: 'Regular venue for household discussion/feedback' },
  { id: 29, order: 29, domains: ['Accessibility and Dementia-Friendly Design'],    text: 'Staff trained in dementia-friendly care' },
  { id: 30, order: 30, domains: ['Accessibility and Dementia-Friendly Design'],    text: 'Sensory-appropriate spaces available' },
  { id: 31, order: 31, domains: ['Accessibility and Dementia-Friendly Design'],    text: 'Wayfinding uses signage, colour, cues' },
  { id: 32, order: 32, domains: ['Accessibility and Dementia-Friendly Design'],    text: 'Noise/overstimulation actively managed' },
  { id: 33, order: 33, domains: ['Physical Environment'],                          text: 'Small household model in place' },
  { id: 34, order: 34, domains: ['Physical Environment'],                          text: 'Shared kitchen/living areas actively used' },
  { id: 35, order: 35, domains: ['Physical Environment'],                          text: 'Personalization of communal spaces encouraged' },
  { id: 36, order: 36, domains: ['Physical Environment'],                          text: 'Year-round access to outdoor spaces' },
  { id: 37, order: 37, domains: ['Physical Environment'],                          text: 'Outdoor spaces include seating and shade' },
  { id: 38, order: 38, domains: ['Operations and Workforce Practices'],            text: 'Staffing levels support flexibility/choice' },
  { id: 39, order: 39, domains: ['Operations and Workforce Practices'],            text: 'Staff roles allow routine adaptation' },
  { id: 40, order: 40, domains: ['Operations and Workforce Practices'],            text: 'Teams can adjust routines in the moment' },
  { id: 41, order: 41, domains: ['Operations and Workforce Practices'],            text: 'Onboarding reinforces autonomy/connection' },
  { id: 42, order: 42, domains: ['Operations and Workforce Practices'],            text: 'Staff wellness supported for sustainability' },
  { id: 43, order: 43, domains: ['Building Design, Technology, and Partnerships'], text: 'Dementia-friendly building features present' },
  { id: 44, order: 44, domains: ['Building Design, Technology, and Partnerships'], text: 'Lighting and temperature adjustable' },
  { id: 45, order: 45, domains: ['Building Design, Technology, and Partnerships'], text: 'Technology supports safety + autonomy' },
  { id: 46, order: 46, domains: ['Building Design, Technology, and Partnerships'], text: 'Community business partnerships active' },
  { id: 47, order: 47, domains: ['Measurement and Outcomes'],                      text: 'Resident/family/staff satisfaction measured' },
  { id: 48, order: 48, domains: ['Measurement and Outcomes'],                      text: 'Health outcomes tracked' },
  { id: 49, order: 49, domains: ['Measurement and Outcomes'],                      text: 'Retention and turnover monitored' },
  { id: 50, order: 50, domains: ['Measurement and Outcomes'],                      text: 'Data shared with residents/families/staff' },
  { id: 51, order: 51, domains: ['Measurement and Outcomes'],                      text: 'Qualitative stories complement quantitative data' },
]

const INIT_TEMPLATES = [
  {
    id: 1,
    title: 'Existing Care Home',
    description: 'This home is building its team. Questions will focus on the culture, values, and practices you want to establish from the get go.',
    indicators: [
      { indicatorId:  1, allowNA: false }, { indicatorId:  4, allowNA: false },
      { indicatorId:  9, allowNA: false }, { indicatorId: 13, allowNA: false },
      { indicatorId: 17, allowNA: false }, { indicatorId: 21, allowNA: false },
      { indicatorId: 25, allowNA: true  }, { indicatorId: 29, allowNA: false },
      { indicatorId: 33, allowNA: true  }, { indicatorId: 38, allowNA: false },
      { indicatorId: 43, allowNA: false }, { indicatorId: 47, allowNA: false },
    ],
  },
  {
    id: 2,
    title: 'New Care Home',
    description: 'This home is building its team. Questions will focus on the culture, values, and practices you want to establish from the get go.',
    indicators: [
      { indicatorId:  2, allowNA: false }, { indicatorId:  5, allowNA: false },
      { indicatorId: 10, allowNA: false }, { indicatorId: 14, allowNA: false },
      { indicatorId: 18, allowNA: false }, { indicatorId: 22, allowNA: false },
      { indicatorId: 26, allowNA: true  }, { indicatorId: 30, allowNA: false },
      { indicatorId: 34, allowNA: false }, { indicatorId: 39, allowNA: false },
      { indicatorId: 44, allowNA: true  }, { indicatorId: 48, allowNA: false },
    ],
  },
]

export default function AssessmentTemplates() {
  const [indicators, setIndicators] = useState(INIT_INDICATORS)
  const [templates, setTemplates]   = useState(INIT_TEMPLATES)

  // Question bank filters
  const [domainFilter,    setDomainFilter]    = useState(null)
  const [filterPopover,   setFilterPopover]   = useState(false)

  // Add / edit indicator
  const [addIndicatorOpen,  setAddIndicatorOpen]  = useState(false)
  const [editingIndicator,  setEditingIndicator]  = useState(null)

  // Template detail
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [editingTitle,     setEditingTitle]     = useState(false)
  const [titleValue,       setTitleValue]       = useState('')
  const [editingDesc,      setEditingDesc]      = useState(false)
  const [descValue,        setDescValue]        = useState('')

  // Question bank panel
  const [aqSearch,         setAqSearch]         = useState('')
  const [aqDomain,         setAqDomain]         = useState(null)
  const [selectedNewIds,   setSelectedNewIds]   = useState([])

  const [addForm]    = Form.useForm()
  const [editForm]   = Form.useForm()
  const [messageApi, ctx] = message.useMessage()

  // ── Indicator Bank ──────────────────────────────────────────────────────────

  const filteredBank = useMemo(() => {
    if (!domainFilter) return indicators
    return indicators.filter(i => i.domains.includes(domainFilter))
  }, [indicators, domainFilter])

  const handleAddIndicator = (values) => {
    const nextOrder = Math.max(...indicators.map(i => i.order), 0) + 1
    setIndicators(prev => [...prev, { id: Date.now(), order: nextOrder, text: values.text, domains: values.domains }])
    messageApi.success('Indicator added.')
    setAddIndicatorOpen(false)
    addForm.resetFields()
  }

  const handleEditSave = (values) => {
    setIndicators(prev => prev.map(i => i.id === editingIndicator.id ? { ...i, ...values } : i))
    messageApi.success('Indicator updated.')
    setEditingIndicator(null)
  }

  const confirmRemoveIndicator = (indicator) => {
    Modal.confirm({
      title: 'Archive this indicator?',
      content: 'This indicator will be removed from any templates it currently belongs to. Past assessments are not affected.',
      okText: 'Archive', okType: 'danger',
      onOk: () => {
        setIndicators(prev => prev.filter(i => i.id !== indicator.id))
        setTemplates(prev => prev.map(t => ({ ...t, indicators: t.indicators.filter(ti => ti.indicatorId !== indicator.id) })))
        if (selectedTemplate) {
          setSelectedTemplate(prev => prev
            ? { ...prev, indicators: prev.indicators.filter(ti => ti.indicatorId !== indicator.id) }
            : null
          )
        }
        messageApi.success('Indicator archived.')
      },
    })
  }

  const openEdit = (indicator) => {
    setEditingIndicator(indicator)
    editForm.setFieldsValue({ text: indicator.text, domains: indicator.domains })
  }

  const getTemplateLabel = (indicatorId) => {
    const matches = templates.filter(t => t.indicators.some(ti => ti.indicatorId === indicatorId))
    if (matches.length === 0) return null
    if (matches.length >= templates.length) return 'All templates'
    return matches.map(t => t.title).join(', ')
  }

  const bankColumns = [
    {
      title: 'Question', dataIndex: 'text', key: 'text',
    },
    {
      title: 'Template', key: 'template', width: 180,
      render: (_, record) => {
        const label = getTemplateLabel(record.id)
        return label
          ? <Text style={{ fontSize: 13 }}>{label}</Text>
          : <Text type="secondary" style={{ fontSize: 13 }}>—</Text>
      },
    },
    {
      title: 'Domains', dataIndex: 'domains', key: 'domains', width: 240,
      render: (domains) => {
        const first = domains[0]
        const extra = domains.length - 1
        return (
          <Space size={4}>
            {first && <Tag color={DOMAIN_COLORS[first]}>{first}</Tag>}
            {extra > 0 && <Tag>+{extra}</Tag>}
          </Space>
        )
      },
    },
    {
      title: 'Actions', key: 'actions', width: 160,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>Edit</Button>
          <Button size="small" icon={<InboxOutlined />} onClick={() => confirmRemoveIndicator(record)}>Archive</Button>
        </Space>
      ),
    },
  ]

  // ── Template detail ─────────────────────────────────────────────────────────

  const openTemplate = (t) => {
    setSelectedTemplate(t)
    setTitleValue(t.title)
    setDescValue(t.description)
    setEditingTitle(false)
    setEditingDesc(false)
  }

  const syncTemplate = (updated) => {
    setTemplates(prev => prev.map(t => t.id === updated.id ? updated : t))
    setSelectedTemplate(updated)
  }

  const saveTitle = () => {
    if (!titleValue.trim()) return
    syncTemplate({ ...selectedTemplate, title: titleValue })
    setEditingTitle(false)
    messageApi.success('Title updated.')
  }

  const saveDesc = () => {
    syncTemplate({ ...selectedTemplate, description: descValue })
    setEditingDesc(false)
    messageApi.success('Description updated.')
  }

  const toggleNA = (indicatorId, checked) => {
    syncTemplate({
      ...selectedTemplate,
      indicators: selectedTemplate.indicators.map(ti =>
        ti.indicatorId === indicatorId ? { ...ti, allowNA: checked } : ti
      ),
    })
  }

  const removeFromTemplate = (indicatorId) => {
    syncTemplate({ ...selectedTemplate, indicators: selectedTemplate.indicators.filter(ti => ti.indicatorId !== indicatorId) })
    messageApi.success('Question removed from template.')
  }

  const removeDomain = (domain) => {
    const domainIndicatorIds = new Set(
      indicators.filter(i => i.domains.includes(domain)).map(i => i.id)
    )
    syncTemplate({ ...selectedTemplate, indicators: selectedTemplate.indicators.filter(ti => !domainIndicatorIds.has(ti.indicatorId)) })
    messageApi.success(`"${domain}" section removed.`)
  }

  const templateIndicatorIds = useMemo(
    () => new Set(selectedTemplate?.indicators.map(ti => ti.indicatorId) ?? []),
    [selectedTemplate]
  )

  const availableToAdd = useMemo(() => indicators
    .filter(i => !templateIndicatorIds.has(i.id))
    .filter(i => !aqDomain || i.domains.includes(aqDomain))
    .filter(i => !aqSearch || i.text.toLowerCase().includes(aqSearch.toLowerCase())),
    [indicators, templateIndicatorIds, aqDomain, aqSearch]
  )

  const handleAddQuestions = () => {
    syncTemplate({ ...selectedTemplate, indicators: [...selectedTemplate.indicators, ...selectedNewIds.map(id => ({ indicatorId: id, allowNA: false }))] })
    setAddQuestionsOpen(false)
    messageApi.success(`${selectedNewIds.length} indicator${selectedNewIds.length > 1 ? 's' : ''} added to template.`)
  }

  const toggleSelectQuestion = (id) =>
    setSelectedNewIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const templateByDomain = useMemo(() => {
    if (!selectedTemplate) return []
    return DOMAINS
      .map(domain => {
        const rows = selectedTemplate.indicators
          .map(ti => {
            const ind = indicators.find(i => i.id === ti.indicatorId)
            return ind && ind.domains.includes(domain)
              ? { ...ind, allowNA: ti.allowNA, key: `${ti.indicatorId}-${domain}` }
              : null
          })
          .filter(Boolean)
          .sort((a, b) => a.order - b.order)
        return rows.length ? { domain, rows } : null
      })
      .filter(Boolean)
  }, [selectedTemplate, indicators])

  const totalQuestions = useMemo(
    () => templateByDomain.reduce((sum, g) => sum + g.rows.length, 0),
    [templateByDomain]
  )

  // ── Template detail view ────────────────────────────────────────────────────

  if (selectedTemplate) {
    return (
      <div style={{ padding: '32px 40px' }}>
        {ctx}
        <Button type="link" icon={<ArrowLeftOutlined />} style={{ padding: 0, marginBottom: 20 }}
          onClick={() => setSelectedTemplate(null)}>
          Back to Templates
        </Button>

        <div style={{ marginBottom: 12 }}>
          {editingTitle ? (
            <Space>
              <Input value={titleValue} onChange={e => setTitleValue(e.target.value)} onPressEnter={saveTitle}
                style={{ width: 320, fontSize: 20, fontWeight: 700 }} />
              <Button icon={<CheckOutlined />} type="primary" onClick={saveTitle}>Save</Button>
              <Button icon={<CloseOutlined />} onClick={() => { setEditingTitle(false); setTitleValue(selectedTemplate.title) }}>Cancel</Button>
            </Space>
          ) : (
            <Space align="center">
              <Title level={3} style={{ margin: 0 }}>{selectedTemplate.title}</Title>
              <Button type="text" size="small" icon={<EditOutlined />} onClick={() => setEditingTitle(true)} />
            </Space>
          )}
        </div>

        <div style={{ marginBottom: 28 }}>
          {editingDesc ? (
            <Space orientation="vertical" style={{ width: '100%', maxWidth: 600 }}>
              <TextArea value={descValue} onChange={e => setDescValue(e.target.value)} rows={3} autoSize={{ minRows: 2, maxRows: 5 }} />
              <Space>
                <Button icon={<CheckOutlined />} type="primary" size="small" onClick={saveDesc}>Save</Button>
                <Button icon={<CloseOutlined />} size="small" onClick={() => { setEditingDesc(false); setDescValue(selectedTemplate.description) }}>Cancel</Button>
              </Space>
            </Space>
          ) : (
            <Space align="start">
              <Text type="secondary">{selectedTemplate.description}</Text>
              <Button type="text" size="small" icon={<EditOutlined />} onClick={() => setEditingDesc(true)} />
            </Space>
          )}
        </div>

        <Text strong style={{ display: 'block', marginBottom: 16 }}>
          {totalQuestions} question{totalQuestions !== 1 ? 's' : ''} across {templateByDomain.length} domain{templateByDomain.length !== 1 ? 's' : ''}
        </Text>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

          {/* Left: domain cards */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {templateByDomain.map(group => (
              <div key={group.domain} style={{ background: '#fff', borderRadius: 10, border: '1px solid #f0f0f0', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', background: '#fafafa', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Text strong style={{ fontSize: 13 }}>{group.domain}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{group.rows.length} question{group.rows.length !== 1 ? 's' : ''}</Text>
                  <Tooltip title="Remove section">
                    <Button type="text" size="small" danger icon={<DeleteOutlined />} style={{ marginLeft: 'auto' }} onClick={() => removeDomain(group.domain)} />
                  </Tooltip>
                </div>
                {group.rows.map((q, i) => (
                  <div key={q.key}>
                    {i > 0 && <div style={{ height: 1, background: '#f5f5f5', marginLeft: 16 }} />}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                      <Text style={{ flex: 1, fontSize: 13 }}>{q.text}</Text>
                      <Space size={16} style={{ flexShrink: 0 }}>
                        <Tooltip title="When ON, respondents can mark this question Not Applicable. N/A responses are excluded from score calculations.">
                          <Space size={6}>
                            <Text type="secondary" style={{ fontSize: 12 }}>N/A</Text>
                            <Switch size="small" checked={q.allowNA} onChange={v => toggleNA(q.id, v)} />
                          </Space>
                        </Tooltip>
                        <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => removeFromTemplate(q.id)} />
                      </Space>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Right: question bank panel */}
          <div style={{ width: 340, flexShrink: 0, position: 'sticky', top: 28 }}>
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #f0f0f0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
                <Text strong style={{ fontSize: 13 }}>Add questions</Text>
              </div>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                <Input prefix={<SearchOutlined />} placeholder="Search indicators…"
                  value={aqSearch} onChange={e => setAqSearch(e.target.value)} />
                <Select placeholder="Filter by domain" allowClear style={{ width: '100%' }}
                  value={aqDomain} onChange={setAqDomain} options={DOMAINS.map(d => ({ value: d, label: d }))} />
              </div>
              {availableToAdd.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text type="secondary">No indicators available to add.</Text>
                </div>
              ) : (
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', background: '#fafafa' }}
                    onClick={() => {
                      const allIds = availableToAdd.map(i => i.id)
                      setSelectedNewIds(allIds.every(id => selectedNewIds.includes(id)) ? [] : allIds)
                    }}
                  >
                    <Checkbox
                      checked={availableToAdd.every(i => selectedNewIds.includes(i.id))}
                      indeterminate={selectedNewIds.length > 0 && !availableToAdd.every(i => selectedNewIds.includes(i.id))}
                      onChange={() => {}}
                    />
                    <Text style={{ fontSize: 13, fontWeight: 500 }}>Select all ({availableToAdd.length})</Text>
                  </div>
                  {availableToAdd.map(indicator => (
                    <div key={indicator.id}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 16px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
                      onClick={() => toggleSelectQuestion(indicator.id)}
                    >
                      <Checkbox checked={selectedNewIds.includes(indicator.id)} style={{ marginTop: 2 }} onChange={() => toggleSelectQuestion(indicator.id)} />
                      <div style={{ flex: 1 }}>
                        <Text style={{ display: 'block', fontSize: 13 }}>{indicator.text}</Text>
                        <Space size={4} style={{ marginTop: 4 }}>
                          {indicator.domains.map(d => <Tag key={d} color={DOMAIN_COLORS[d]}>{d}</Tag>)}
                        </Space>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0' }}>
                <Button type="primary" block disabled={selectedNewIds.length === 0} onClick={handleAddQuestions}>
                  {selectedNewIds.length > 0 ? `Add to template (${selectedNewIds.length})` : 'Add to template'}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }

  // ── Main page ───────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: '32px 40px' }}>
      {ctx}

      <Title level={2} style={{ marginBottom: 28 }}>Assessment templates</Title>

      {/* Templates section */}
      <div style={{ marginBottom: 40 }}>
        <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, color: '#8c8c8c', display: 'block', marginBottom: 14 }}>
          Templates
        </Text>
        <Row gutter={16}>
          {templates.map(t => (
            <Col span={12} key={t.id} style={{ maxWidth: 340 }}>
              <Card style={{ borderRadius: 8, border: '1px solid #e5e7eb' }} styles={{ body: { padding: '20px 20px 20px' } }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                    <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 4 }}>{t.title}</Text>
                    <Text style={{ fontSize: 13, color: '#0891b2', display: 'block', marginBottom: 10 }}>
                      {t.indicators.length} questions · {new Set(t.indicators.flatMap(ti => indicators.find(i => i.id === ti.indicatorId)?.domains ?? [])).size} domains
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>{t.description}</Text>
                  </div>
                  <Space size={0}>
                    <Button type="text" size="small" icon={<EditOutlined style={{ color: '#1677ff' }} />}
                      onClick={() => openTemplate(t)} />
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Question Bank section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Question Bank ({indicators.length})</Title>
          <Space>
            <Popover
              open={filterPopover}
              onOpenChange={setFilterPopover}
              trigger="click"
              placement="bottomRight"
              content={
                <div style={{ width: 240 }}>
                  <Text style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8 }}>Filter by Domain</Text>
                  <Select
                    placeholder="All domains"
                    allowClear
                    style={{ width: '100%' }}
                    value={domainFilter}
                    onChange={v => { setDomainFilter(v); setFilterPopover(false) }}
                    options={DOMAINS.map(d => ({ value: d, label: d }))}
                  />
                </div>
              }
            >
              <Button icon={<FilterOutlined />} type={domainFilter ? 'primary' : 'default'}>
                Filter{domainFilter ? ': active' : ''}
              </Button>
            </Popover>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddIndicatorOpen(true)}>
              Add new Indicator
            </Button>
          </Space>
        </div>

        <Table
          dataSource={filteredBank}
          columns={bankColumns}
          rowKey="id"
          pagination={false}
          size="middle"
          bordered
        />
      </div>

      {/* Add Indicator Drawer */}
      <Drawer
        title="Add new indicator"
        open={addIndicatorOpen}
        onClose={() => { setAddIndicatorOpen(false); addForm.resetFields() }}
        width={480}
        destroyOnHidden
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => { setAddIndicatorOpen(false); addForm.resetFields() }}>Cancel</Button>
            <Button type="primary" onClick={() => addForm.submit()}>Add indicator</Button>
          </Space>
        }
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddIndicator}>
          <Form.Item name="text" label="Indicator text"
            rules={[{ required: true, message: 'Required.' }, { max: 150, message: 'Max 150 characters.' }]}>
            <TextArea rows={3} maxLength={150} showCount placeholder="Enter indicator text…" />
          </Form.Item>
          <Form.Item name="domains" label="Domain(s)" rules={[{ required: true, message: 'Select at least one domain.' }]}>
            <Select mode="multiple" placeholder="Select domain(s)" options={DOMAINS.map(d => ({ value: d, label: d }))} />
          </Form.Item>
        </Form>
      </Drawer>

      {/* Edit Indicator Drawer */}
      <Drawer
        title="Edit Indicator"
        open={!!editingIndicator}
        onClose={() => setEditingIndicator(null)}
        width={480}
        destroyOnHidden
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setEditingIndicator(null)}>Cancel</Button>
            <Button type="primary" onClick={() => editForm.submit()}>Save</Button>
          </Space>
        }
      >
        {editingIndicator && (
          <Form form={editForm} layout="vertical" onFinish={handleEditSave}
            initialValues={{ text: editingIndicator.text, domains: editingIndicator.domains }}>
            <Form.Item name="text" label="Indicator Text"
              rules={[{ required: true, message: 'Required.' }, { max: 150, message: 'Max 150 characters.' }]}>
              <TextArea rows={3} maxLength={150} showCount />
            </Form.Item>
            <Form.Item name="domains" label="Domain(s)" rules={[{ required: true, message: 'Select at least one domain.' }]}>
              <Select mode="multiple" options={DOMAINS.map(d => ({ value: d, label: d }))} />
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </div>
  )
}

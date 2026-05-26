import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Menu, Button } from 'antd'
import {
  HomeOutlined, FileTextOutlined, LogoutOutlined,
} from '@ant-design/icons'
import AssessmentTemplates from './admin/AssessmentTemplates'
import CareHomeProfile from './admin/CareHomeProfile'

const { Sider } = Layout

const ALLDAY_CARE_HOME = {
  key: '1',
  name: 'Sunnydale Care Home',
  contact: 'Olivia Davis',
  location: 'Vancouver, BC',
  address: '247 Hastings Street East, Vancouver, BC V6A 1P1',
  beds: 100,
  status: 'In Progress',
  homeLeader: {
    name: 'Olivia Davis',
    title: 'Director of Care',
    phone: '+1 (604) 555-0147',
    email: 'olivia.davis@alldaycare.ca',
  },
  teamMemberCount: 4,
}

const menuItems = [
  { key: 'carehome',  icon: <HomeOutlined />,      label: 'Allday Care Home' },
  { key: 'templates', icon: <FileTextOutlined />,   label: 'Assessment Templates' },
]

export default function AdminPortal() {
  const navigate = useNavigate()
  const [selectedKey, setSelectedKey] = useState('carehome')

  const handleSelectMenu = ({ key }) => setSelectedKey(key)

  const sectionContent = {
    carehome:  <CareHomeProfile careHome={ALLDAY_CARE_HOME} />,
    templates: <AssessmentTemplates />,
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={240} style={{ background: 'rgb(57,126,133)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
          {/* Logo */}
          <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <img src="/logo.svg" alt="Home for Us" style={{ height: 36, display: 'block' }} />
          </div>

          {/* Nav */}
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ flex: 1, border: 'none', marginTop: 8 }}
            items={menuItems}
            onSelect={handleSelectMenu}
          />

          {/* Logout */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Button
              block ghost icon={<LogoutOutlined />}
              onClick={() => navigate('/')}
              style={{ borderRadius: 8, color: 'rgb(243,250,250)', borderColor: 'rgba(243,250,250,0.35)' }}
            >
              Logout
            </Button>
          </div>
        </div>
      </Sider>

      <Layout style={{ background: 'rgb(249,244,238)', overflowY: 'auto' }}>
        {sectionContent[selectedKey] ?? sectionContent.carehome}
      </Layout>
    </Layout>
  )
}

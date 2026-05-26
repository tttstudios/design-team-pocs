import { ConfigProvider } from 'antd'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import AdminPortal from './pages/AdminPortal'
import './App.css'

const theme = {
  token: {
    colorTextBase:          '#151d2ce0',
    colorBorder:            '#151d2c1a',
    colorBorderSecondary:   '#d8deec',
    colorSuccessBg:         '#f4f9f5',
    colorSuccessBgHover:    '#e3f1e5',
    colorSuccessBorder:     '#cee7d2',
    colorSuccessBorderHover:'#a7d1b0',
    colorSuccessHover:      '#a7d1b0',
    colorSuccess:           '#619e6e',
    colorWarning:           '#e8ab3a',
    colorError:             '#bd4a3b',
    colorPrimary:           '#4f6ba2',
    colorInfo:              '#4f6ba2',
    borderRadius:           12,
    fontFamily:             "'Lato', sans-serif",
  },
  components: {
    Layout: {
      bodyBg: 'rgb(249,244,238)',
    },
    Menu: {
      groupTitleColor:          'rgb(166,209,212)',
      itemBg:                   'rgb(57,126,133)',
      subMenuItemBg:            'rgb(12,106,111)',
      itemColor:                'rgb(243,250,250)',
      itemDisabledColor:        'rgb(160,204,207)',
      itemActiveBg:             'rgb(12,67,71)',
      itemHoverBg:              'rgb(16,89,94)',
      itemHoverColor:           'rgb(243,250,250)',
      itemSelectedBg:           'rgb(18,80,84)',
      itemSelectedColor:        'rgb(243,250,250)',
      subMenuItemSelectedColor: 'rgb(243,250,250)',
      colorBgElevated:          'rgb(243,250,250)',
      dangerItemSelectedBg:     'rgb(252,241,239)',
      dangerItemColor:          'rgb(249,211,204)',
      dangerItemHoverColor:     'rgb(255,183,170)',
      dangerItemSelectedColor:  'rgb(226,65,37)',
    },
    Table: {
      borderColor:        'rgba(172,181,201,0.5)',
      headerBg:           'rgb(62,82,125)',
      headerColor:        'rgb(247,248,251)',
      headerSplitColor:   'rgb(70,87,120)',
      headerSortActiveBg: 'rgb(51,67,104)',
      headerSortHoverBg:  'rgb(79,107,162)',
      colorIcon:          'rgb(216,222,236)',
      rowHoverBg:         'rgb(247,248,251)',
      colorLink:          'rgb(22,119,255)',
    },
    Tooltip: {
      colorBgSpotlight: 'rgb(41,52,81)',
      colorText:        'rgb(247,248,251)',
    },
    Typography: {
      colorText:            'rgba(21,29,44,0.85)',
      colorTextDescription: 'rgba(21,29,44,0.5)',
      colorTextDisabled:    'rgba(21,29,44,0.25)',
      colorTextHeading:     'rgb(21,29,44)',
      colorWarningText:     'rgb(205,137,26)',
      colorErrorText:       'rgb(189,74,59)',
      colorErrorTextActive: 'rgb(167,61,49)',
      colorErrorTextHover:  'rgb(217,119,102)',
      colorSuccess:         'rgb(97,158,110)',
      colorSuccessText:     'rgb(97,158,110)',
      colorLink:            'rgb(22,119,255)',
    },
    Drawer: {
      colorBgMask:   'rgba(41,52,81,0.5)',
      colorIcon:     'rgb(21,29,44)',
      colorIconHover:'rgb(41,52,81)',
      colorText:     'rgba(21,29,44,0.88)',
      colorSplit:    'rgb(216,222,236)',
    },
    Button: {
      colorBgContainerDisabled: 'rgba(216,222,236,0.2)',
      colorPrimaryActive:       'rgb(51,67,104)',
      colorPrimaryBg:           'rgb(216,222,236)',
      colorPrimaryHover:        'rgb(103,122,173)',
      colorTextDisabled:        'rgba(21,29,44,0.45)',
      textHoverBg:              'rgba(103,122,173,0.1)',
      textTextColor:            'rgb(22,119,255)',
      textTextHoverColor:       'rgb(51,67,104)',
      colorError:               'rgb(189,74,59)',
      colorErrorActive:         'rgb(167,61,49)',
      colorErrorHover:          'rgb(217,119,102)',
      colorErrorBg:             'rgb(255,246,245)',
      colorErrorBgActive:       'rgb(250,225,219)',
      colorErrorBgFilledHover:  'rgb(250,225,219)',
      colorPrimary:             'rgb(79,107,162)',
      colorLink:                'rgb(22,119,255)',
    },
    Divider: {
      colorSplit:      'rgba(216,222,236,0.88)',
      colorText:       'rgba(21,29,44,0.88)',
      colorTextHeading:'rgba(21,29,44,0.88)',
    },
    Pagination: {
      colorPrimary:             'rgb(103,122,173)',
      itemActiveBg:             'rgb(79,107,162)',
      itemActiveColor:          'rgb(255,255,255)',
      itemActiveColorDisabled:  'rgba(21,29,44,0.45)',
      itemActiveBgDisabled:     'rgba(216,222,236,0.2)',
      colorTextDisabled:        'rgba(21,29,44,0.45)',
      itemActiveColorHover:     'rgb(255,255,255)',
      colorBgTextHover:         'rgb(216,222,236)',
      colorBorder:              'rgb(103,122,173)',
      colorPrimaryBorder:       'rgb(103,122,173)',
      colorPrimaryHover:        'rgb(154,169,205)',
      colorText:                'rgba(21,29,44,0.88)',
      controlOutline:           'rgb(247,248,251)',
    },
    Checkbox: {
      colorPrimary:            'rgb(79,107,162)',
      colorPrimaryHover:       'rgb(103,122,173)',
      colorPrimaryBorder:      'rgb(62,82,125)',
      colorText:               'rgba(21,29,44,0.88)',
      colorTextDisabled:       'rgba(21,29,44,0.45)',
      colorBorder:             'rgba(21,29,44,0.25)',
      colorBgContainerDisabled:'rgba(216,222,236,0.2)',
    },
    Spin:     { colorPrimary: 'rgb(103,122,173)' },
    Skeleton: { gradientFromColor: 'rgba(103,122,173,0.12)', gradientToColor: 'rgba(103,122,173,0.2)' },
    Steps:    { colorPrimary: 'rgb(103,122,173)', colorPrimaryBg: 'rgba(216,222,236,0.47)' },
    Progress: { defaultColor: 'rgb(78,131,215)', remainingColor: 'rgba(216,222,236,0.5)' },
    Popconfirm: { colorWarning: 'rgb(232,171,58)' },
    Cascader: {
      optionSelectedBg:   'rgba(216,222,236,0.43)',
      colorPrimary:       'rgb(79,107,162)',
      colorPrimaryBorder: 'rgb(103,122,173)',
      colorPrimaryHover:  'rgb(103,122,173)',
    },
    Message: { colorInfo: 'rgb(78,131,215)' },
    Modal:   { colorBgMask: 'rgba(41,52,81,0.5)' },
    Tree: {
      colorPrimaryBorder: 'rgb(103,122,173)',
      colorPrimaryHover:  'rgb(103,122,173)',
      colorPrimary:       'rgb(79,107,162)',
    },
    Timeline: { tailColor: 'rgba(21,29,44,0.15)' },
    Tabs: {
      itemActiveColor:   'rgb(0,46,121)',
      inkBarColor:       'rgb(0,46,121)',
      itemSelectedColor: 'rgb(69,97,144)',
      itemColor:         'rgba(21,29,44,0.5)',
    },
    Segmented: {
      trackBg:          'rgb(239,240,242)',
      itemColor:        'rgba(21,29,44,0.5)',
      itemHoverBg:      'rgba(186,195,220,0.43)',
      itemHoverColor:   'rgb(0,0,0)',
      itemSelectedBg:   'rgb(255,255,255)',
      itemSelectedColor:'rgb(21,29,44)',
    },
    List:     { colorPrimary: 'rgb(79,107,162)' },
    Calendar: {
      colorPrimary:        'rgb(79,107,162)',
      itemActiveBg:        'rgba(216,222,236,0.3)',
      controlItemBgHover:  'rgb(247,248,251)',
      colorTextDisabled:   'rgba(21,29,44,0.35)',
    },
    Rate:   { starColor: 'rgb(242,196,98)' },
    Select: { optionSelectedBg: 'rgba(216,222,236,0.43)' },
    Badge: {
      colorInfo:    'rgb(0,101,255)',
      colorWarning: 'rgb(242,196,98)',
      colorSuccess: 'rgb(134,188,146)',
    },
    Alert: { colorInfoBg: 'rgb(245,249,255)' },
    Collapse: {},
  },
}

function App() {
  return (
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<AdminPortal />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App

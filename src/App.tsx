import { ConfigProvider } from 'antd'
import BasicLayout from './layout/BasicLayout'

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgBase: '#1E1E1F',
          colorTextBase: '#fff',
          colorLink: 'rgba(244, 196, 109, 1)',
          colorLinkActive: 'rgba(244, 196, 109, 0.8)',
          colorLinkHover: 'rgba(244, 196, 109, 0.8)',
          colorPrimary: 'rgba(255, 171, 79, 1)'
        }
      }}
    >
      <div
        id="test-pro-layout"
        style={{
          height: '100vh'
        }}
      >
        {/* <Suspense fallback={<Loading />}> */}
        <BasicLayout />
        {/* </Suspense> */}
      </div>
    </ConfigProvider>
  )
}

export default App

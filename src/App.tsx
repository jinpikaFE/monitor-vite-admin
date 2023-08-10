import { ConfigProvider } from 'antd'
import BasicLayout from './layout/BasicLayout'
import { useEffect, useState } from 'react'
import webSee from '@websee/core'
import performance from '@websee/performance'
import recordscreen from '@websee/recordscreen'
import { useLocation } from 'react-router-dom'
import { useAsyncEffect } from 'ahooks'
import { getIpInfo } from './apis'
import { storeMonitor } from './store/monitor'

const App = () => {
  const [isHandled, setIsHandled] = useState(false)
  const location = useLocation()
  const [pvStartTime, setPvStartTime] = useState<number>()

  useEffect(() => {
    webSee.init({
      dsn: `${import.meta.env.VITE_MONITOR_URL}/v1/monitor`,
      apikey: import.meta.env.VITE_APP_NAME,
      userId: import.meta.env.VITE_APP_NAME
    })

    webSee.use(performance, {})
    webSee.use(recordscreen, {})
  }, [])

  /** 获取ip 记录uv */
  useAsyncEffect(async () => {
    const res = await getIpInfo()
    if (res?.code === 200) {
      storeMonitor.setUvInfo({
        ip: res?.data?.ip,
        startTime: new Date().getTime(),
        area: `${res?.data?.countryName || ''}${res?.data?.provinceName || ''}${
          res?.data?.cityName || ''
        }`
      })
    }
  }, [])

  useEffect(() => {
    const handlePageClose = (event: Event) => {
      if (!isHandled) {
        // Your cleanup logic or confirmation message here
        webSee.log({
          type: 'uv',
          message: storeMonitor.uvInfo
        })
        /** 最后离开记录pv */
        webSee.log({
          type: 'pv',
          message: {
            startTime: pvStartTime,
            pathname: window.location?.pathname
          }
        })
        setIsHandled(true)
      }
    }

    const addEventListeners = () => {
      window.addEventListener('beforeunload', handlePageClose)
      window.addEventListener('pagehide', handlePageClose)
      window.addEventListener('unload', handlePageClose)
    }

    const removeEventListeners = () => {
      window.removeEventListener('beforeunload', handlePageClose)
      window.removeEventListener('pagehide', handlePageClose)
      window.removeEventListener('unload', handlePageClose)
    }

    addEventListeners()

    // Remove the event listeners when the component unmounts
    return () => {
      removeEventListeners()
    }
  }, [isHandled, pvStartTime])

  /** pv记录 */
  useEffect(() => {
    const startTime = new Date().getTime()
    setPvStartTime(startTime)
    return () => {
      webSee.log({
        type: 'pv',
        message: {
          startTime,
          pathname: location?.pathname
        }
      })
    }
  }, [location])

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

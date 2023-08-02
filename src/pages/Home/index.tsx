import { ProCard, ProFormDateTimeRangePicker, ProFormSelect } from '@ant-design/pro-components'
import PerformanceTable from './components/performanceTable'
import { getApikeyList } from '@/apis/projects'
import { useState } from 'react'
import { MonitorContext } from './context'
import { Space } from 'antd'
import { getFirstDayOfMonth } from '@/utils/date'
import { formatToDateTime } from '@/utils/dateUtil'
import Unhandledrejection from './components/unhandledrejection'
import ErrorInfo from './components/errorInfo'
import XhrInfo from './components/xhrInfo'
import Resource from './components/resource'
import PerformanceCharts from './components/chartComponents/performanceCharts'
import { getUserList } from '@/apis/accessManagement/user'
import SelectPage, { TAsyncGetListObj } from '@/components/selectPage'

const Home: React.FC = () => {
  const [apikeyType, setApikeyType] = useState<string>()
  const [username, setUsername] = useState<string>()
  const [rangeTime, setRangeTime] = useState<any>([
    getFirstDayOfMonth(new Date()),
    formatToDateTime(new Date())
  ])

  const asyncGetList = async (obj: TAsyncGetListObj) => {
    const { setPageProps, setOptions, searchVal, pageProps } = obj
    const res = await getUserList({
      pageNum: pageProps.current || 1,
      pageSize: pageProps.pageSize || 10,
      keyword: searchVal
    })
    setPageProps({ total: res?.data?.total })
    const newData = res?.data?.list?.map((item: any) => {
      return {
        ...item,
        label: item?.username,
        value: item?.username
      }
    })
    setOptions(newData)
  }

  return (
    <MonitorContext.Provider
      value={{
        apikeyType,
        rangeTime,
        username
      }}
    >
      <ProCard style={{ marginBottom: 16 }}>
        <Space>
          <ProFormSelect
            placeholder="项目名称"
            fieldProps={{
              fieldNames: {
                label: 'name',
                value: 'name'
              },
              onChange: val => {
                setApikeyType(val)
              },
              value: apikeyType,
              style: { minWidth: 200 }
            }}
            request={async () => {
              const res = await getApikeyList()
              if (res?.code === 200) {
                setApikeyType(res?.data?.list?.[0]?.name)
                return res?.data?.list
              }
              return []
            }}
          />
          <ProFormDateTimeRangePicker
            fieldProps={{
              value: rangeTime,
              onChange: val => {
                setRangeTime(val)
              }
            }}
          />
          {/* <ProFormSelect
            placeholder="用户名"
            fieldProps={{
              fieldNames: {
                label: 'username',
                value: 'username'
              },
              onChange: val => {
                setUsername(val)
              },
              value: username,
              style: { minWidth: 200 }
            }}
            request={async () => {
              const res = await getUserList({
                pageNum: 1,
                pageSize: 1000
              })
              if (res?.code === 200) {
                return res?.data?.list
              }
              return []
            }}
          /> */}
          <SelectPage
            asyncGetList={asyncGetList}
            value={username}
            onChange={(val: any) => {
              setUsername(val)
            }}
            selectProps={{
              placeholder: '用户名',
              style: { minWidth: 200, marginBottom: 24 },
              mode: 'signle' as any,
              allowClear: true
            }}
          />
        </Space>
      </ProCard>
      <PerformanceCharts />
      <ProCard ghost gutter={[16, 16]}>
        <PerformanceTable />
      </ProCard>
      <ProCard ghost gutter={[16, 16]}>
        <ProCard ghost colSpan={12}>
          <ErrorInfo />
        </ProCard>
        <ProCard ghost colSpan={12}>
          <Unhandledrejection />
        </ProCard>
      </ProCard>
      <ProCard ghost gutter={[16, 16]} wrap>
        <XhrInfo />
      </ProCard>
      <ProCard ghost gutter={[16, 16]}>
        <ProCard ghost colSpan={12}>
          <Resource />
        </ProCard>
        <ProCard ghost>{/* <FetchInfo /> */}</ProCard>
      </ProCard>
    </MonitorContext.Provider>
  )
}

export default Home

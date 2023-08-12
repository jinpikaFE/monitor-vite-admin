import {
  ProCard,
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormText
} from '@ant-design/pro-components'
import PerformanceTable from './components/performanceTable'
import { getApikeyList } from '@/apis/projects'
import { MonitorContext, MonitorType } from './context'
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
import UvTable from './components/uvTable'
import { useReactive } from 'ahooks'
import PvTable from './components/pvTable'

const Home: React.FC = () => {
  const FormVal = useReactive<MonitorType>({
    apikeyType: undefined,
    username: undefined,
    rangeTime: [getFirstDayOfMonth(new Date()), formatToDateTime(new Date())],
    uuid: undefined
  })

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
        apikeyType: FormVal.apikeyType,
        rangeTime: FormVal.rangeTime,
        username: FormVal.username,
        uuid: FormVal.uuid
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
                FormVal.apikeyType = val
              },
              value: FormVal.apikeyType,
              style: { minWidth: 200 }
            }}
            request={async () => {
              const res = await getApikeyList()
              if (res?.code === 200) {
                return res?.data?.list
              }
              return []
            }}
          />
          <ProFormDateTimeRangePicker
            fieldProps={{
              value: FormVal.rangeTime,
              onChange: (_, dateString) => {
                FormVal.rangeTime = dateString
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
          <ProFormText
            placeholder="用户名"
            allowClear
            fieldProps={{
              value: FormVal.username,
              onChange: e => {
                FormVal.username = e?.target?.value
              }
            }}
          />
          {/* <SelectPage
            asyncGetList={asyncGetList}
            value={FormVal.username}
            onChange={(val: any) => {
              FormVal.username = val
            }}
            selectProps={{
              placeholder: '用户名',
              style: { minWidth: 200, marginBottom: 24 },
              mode: 'signle' as any,
              allowClear: true
            }}
          /> */}
          <ProFormText
            placeholder="访客标识"
            allowClear
            fieldProps={{
              value: FormVal.uuid,
              onChange: e => {
                FormVal.uuid = e?.target?.value
              }
            }}
          />
        </Space>
      </ProCard>
      <PerformanceCharts />
      <ProCard ghost gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <PvTable />
      </ProCard>
      <ProCard ghost gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <UvTable />
      </ProCard>
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
      <ProCard ghost gutter={[16, 16]} wrap style={{ marginBottom: 16 }}>
        <XhrInfo />
      </ProCard>
      <ProCard ghost gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Resource />
      </ProCard>
    </MonitorContext.Provider>
  )
}

export default Home

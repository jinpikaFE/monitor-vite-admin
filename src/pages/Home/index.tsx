import { ProCard, ProFormDateTimeRangePicker, ProFormSelect } from '@ant-design/pro-components'
import PerformanceTable from './components/performanceTable'
import { getApikeyList } from '@/apis/projects'
import { useState } from 'react'
import { MonitorContext } from './context'
import { Space } from 'antd'
import { getFirstDayOfMonth } from '@/utils/date'
import { formatToDateTime } from '@/utils/dateUtil'

const Home: React.FC = () => {
  const [apikeyType, setApikeyType] = useState<number>()
  const [rangeTime, setRangeTime] = useState<any>([
    getFirstDayOfMonth(new Date()),
    formatToDateTime(new Date())
  ])

  return (
    <MonitorContext.Provider
      value={{
        apikeyType,
        rangeTime
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
        </Space>
      </ProCard>
      <PerformanceTable />
    </MonitorContext.Provider>
  )
}

export default Home

import { useReactive } from 'ahooks'
import { DashBoardContext } from './context'
import { ProCard, ProFormDateTimeRangePicker } from '@ant-design/pro-components'
import { getFirstDayOfYear } from '@/utils/date'
import { formatToDateTime } from '@/utils/dateUtil'
import StaticCard from './components/staticCard'
import AmapCard from './components/amapCard'

const DashBoard = () => {
  const formVal = useReactive<DashBoardPage.ContextEntity>({
    rangeTime: [getFirstDayOfYear(new Date()), formatToDateTime(new Date())]
  })
  return (
    <DashBoardContext.Provider
      value={{
        rangeTime: formVal.rangeTime
      }}
    >
      <ProCard style={{ marginBottom: 16 }}>
        <ProFormDateTimeRangePicker
          fieldProps={{
            value: formVal.rangeTime,
            onChange: (_, dateString) => {
              formVal.rangeTime = dateString
            }
          }}
        />
      </ProCard>
      <StaticCard />
      <AmapCard />
    </DashBoardContext.Provider>
  )
}

export default DashBoard

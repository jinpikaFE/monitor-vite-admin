import { getMonitorList } from '@/apis/home'
import { EVENTTYPES, PERFORMANCE_TYPE } from '@/apis/home/enum'
import ExcelTable from '@/components/exportExcel'
import { getFirstDayOfMonth } from '@/utils/date'
import { formatToDateTime } from '@/utils/dateUtil'
import { ActionType } from '@ant-design/pro-components'
import { useContext, useRef } from 'react'
import { MonitorContext } from '../../context'

const PerformanceTable: React.FC = () => {
  const monitorContext = useContext(MonitorContext)
  const actionRef = useRef<ActionType>()

  return (
    <ExcelTable
      headerTitle="性能监控"
      columns={[
        {
          title: '指标名称',
          dataIndex: 'name',
          hideInTable: true,
          valueEnum: {
            [PERFORMANCE_TYPE.LongTask]: PERFORMANCE_TYPE.LongTask,
            [PERFORMANCE_TYPE.Memory]: PERFORMANCE_TYPE.Memory,
            [PERFORMANCE_TYPE.ResourceList]: PERFORMANCE_TYPE.ResourceList,
            [PERFORMANCE_TYPE.FSP]: PERFORMANCE_TYPE.FSP,
            [PERFORMANCE_TYPE.FCP]: PERFORMANCE_TYPE.FCP,
            [PERFORMANCE_TYPE.CLS]: PERFORMANCE_TYPE.CLS,
            [PERFORMANCE_TYPE.FID]: PERFORMANCE_TYPE.FID,
            [PERFORMANCE_TYPE.LCP]: PERFORMANCE_TYPE.LCP,
            [PERFORMANCE_TYPE.TTFB]: PERFORMANCE_TYPE.TTFB
          }
        },
        {
          title: '时间',
          dataIndex: 'time',
          hideInTable: true,
          valueType: 'dateTimeRange',
          initialValue: [getFirstDayOfMonth(new Date()), formatToDateTime(new Date())],
          search: {
            transform: val => ({
              startTime: val?.[0],
              endTime: val?.[1]
            })
          }
        },
        /** search */
        {
          title: '访问标识',
          dataIndex: 'uuid',
          hideInSearch: true,
          ellipsis: true
        },
        {
          title: '指标名称',
          dataIndex: 'name',
          hideInSearch: true
        },
        {
          title: '触发地址',
          dataIndex: 'pageUrl',
          hideInSearch: true,
          ellipsis: true
        },
        {
          title: '时间',
          dataIndex: '_time',
          hideInSearch: true,
          valueType: 'dateTime'
        }
      ]}
      form={{
        syncToUrl: false
      }}
      pagination={{
        defaultPageSize: 10
      }}
      rowKey="_time"
      params={{ apikey: monitorContext?.apikeyType }}
      requestFn={async params => {
        const data = await getMonitorList({
          ...params,
          type: EVENTTYPES.PERFORMANCE
        })
        return data
      }}
      actionRef={actionRef}
      rowSelection={false}
      toolBarRenderFn={() => []}
    />
  )
}

export default PerformanceTable

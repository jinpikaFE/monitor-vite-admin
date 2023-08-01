import { getMonitorList } from '@/apis/home'
import { EVENTTYPES, PERFORMANCE_TYPE } from '@/apis/home/enum'
import ExcelTable from '@/components/exportExcel'
import { ActionType, FormInstance } from '@ant-design/pro-components'
import { useContext, useEffect, useRef } from 'react'
import { MonitorContext } from '../../context'

const PerformanceTable: React.FC = () => {
  const monitorContext = useContext(MonitorContext)
  const actionRef = useRef<ActionType>()
  const formRef = useRef<FormInstance>()

  useEffect(() => {
    formRef?.current?.setFieldsValue({
      time: monitorContext?.rangeTime
    })
    formRef?.current?.submit()
  }, [monitorContext?.rangeTime])

  return (
    <ExcelTable
      headerTitle="性能监控"
      ignoreFieldNames={['time']}
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
          search: {
            transform: val => ({
              startTime: val?.[0],
              endTime: val?.[1]
            })
          },
          formItemProps: {
            hidden: true
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
          hideInSearch: true
        },
        {
          title: '评分',
          dataIndex: 'rating',
          hideInSearch: true
        },
        {
          title: '设备信息',
          dataIndex: 'deviceInfo',
          hideInSearch: true,
          render(dom, entity) {
            return entity?.deviceInfo ? (
              <>
                <p>
                  {entity?.deviceInfo?.browser} {entity?.deviceInfo?.browserVersion}
                </p>
                <p>
                  {entity?.deviceInfo?.device_type} {entity?.deviceInfo?.device}{' '}
                  {entity?.deviceInfo?.os} {entity?.deviceInfo?.osVersion}
                </p>
              </>
            ) : (
              '-'
            )
          }
        },
        {
          title: '项目名',
          dataIndex: 'apikey',
          hideInSearch: true
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
        defaultPageSize: 5
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
      formRef={formRef}
      rowSelection={false}
      toolBarRenderFn={() => []}
    />
  )
}

export default PerformanceTable

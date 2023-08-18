import { getMonitorList } from '@/apis/home'
import { EVENTTYPES } from '@/apis/home/enum'
import ExcelTable from '@/components/exportExcel'
import { ActionType, FormInstance } from '@ant-design/pro-components'
import { useContext, useEffect, useRef } from 'react'
import { MonitorContext } from '../../context'
import styles from '../common.module.less'
import { formatToDateTime } from '@/utils/dateUtil'
import BreadcrumbBtn from '../btnComponents/breadcrumbBtn'

const UvTable: React.FC = () => {
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
      headerTitle="UV"
      ignoreFieldNames={['time']}
      className={styles.container}
      scroll={{ x: 1400 }}
      columns={[
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
          title: '访问IP',
          dataIndex: 'message',
          hideInSearch: true,
          render(dom, entity) {
            return entity?.message?.ip || '-'
          }
        },
        {
          title: '访问地区',
          dataIndex: 'message',
          hideInSearch: true,
          render(dom, entity) {
            return entity?.message?.area || '-'
          }
        },
        {
          title: '触发地址',
          dataIndex: 'pageUrl',
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
          title: '用户',
          dataIndex: 'userId',
          hideInSearch: true
        },
        {
          title: '项目名',
          dataIndex: 'apikey',
          hideInSearch: true
        },
        {
          title: '访问开始时间',
          dataIndex: 'message',
          hideInSearch: true,
          render(dom, entity) {
            return formatToDateTime(entity?.message?.startTime) || '-'
          }
        },
        {
          title: '结束时间',
          dataIndex: 'time',
          hideInSearch: true,
          valueType: 'dateTime'
        },
        {
          title: '操作',
          key: 'option',
          valueType: 'option',
          width: '10%',
          fixed: 'right',
          render: (_, entity) => [
            <BreadcrumbBtn record={entity} key="behavior" />,
          ]
        }
      ]}
      form={{
        syncToUrl: false
      }}
      pagination={{
        defaultPageSize: 5
      }}
      rowKey="_id"
      params={{
        apikey: monitorContext?.apikeyType,
        userId: monitorContext?.username,
        uuid: monitorContext?.uuid
      }}
      requestFn={async params => {
        const data = await getMonitorList({
          ...params,
          type: EVENTTYPES.UV
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

export default UvTable

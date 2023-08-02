import { getMonitorList } from '@/apis/home'
import { EVENTTYPES } from '@/apis/home/enum'
import ExcelTable from '@/components/exportExcel'
import { ActionType, FormInstance } from '@ant-design/pro-components'
import { useContext, useEffect, useRef } from 'react'
import { MonitorContext } from '../../context'
import styles from '../common.module.less'
import BreadcrumbBtn from '../btnComponents/breadcrumbBtn'
import PlayScreen from '../btnComponents/playScreen'

const XhrInfo: React.FC = () => {
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
      headerTitle="接口错误"
      ignoreFieldNames={['time']}
      className={styles.container}
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
          title: '请求信息',
          dataIndex: 'requestData',
          hideInSearch: true,
          render(dom, entity) {
            return entity?.requestData ? (
              <>
                <p>{entity?.url}</p>
                <p>{entity?.message}</p>
                <p>
                  请求：{entity?.requestData?.httpType} {entity?.requestData?.method}{' '}
                  {entity?.requestData?.data}
                </p>
                <p>
                  响应：{entity?.response?.status} {entity?.response?.data}
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
          title: '时间',
          dataIndex: '_time',
          hideInSearch: true,
          valueType: 'dateTime'
        },
        {
          title: '操作',
          key: 'option',
          valueType: 'option',
          fixed: 'right',
          width: '20%',
          render: (_, entity) => [
            <BreadcrumbBtn record={entity} key="behavior" />,
            <PlayScreen key="playScreen" record={entity} formRef={formRef} />
          ]
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
          type: EVENTTYPES.API_ERR
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

export default XhrInfo

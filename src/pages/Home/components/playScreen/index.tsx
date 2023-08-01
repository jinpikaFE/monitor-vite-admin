import { getEchartMonitorList } from '@/apis/home'
import { EVENTTYPES } from '@/apis/home/enum'
import { Button, FormInstance, Modal } from 'antd'
import { useContext, useEffect, useRef } from 'react'
import { MonitorContext } from '../../context'
import { useReactive } from 'ahooks'
import ScreenContainer from './screenContainer'

export type ModalPropsType = {
  open: boolean
  events?: string
}

const PlayScreen: React.FC<{
  record: any
  formRef: React.MutableRefObject<FormInstance<any> | undefined>
}> = ({ record, formRef }) => {
  const monitorContext = useContext(MonitorContext)
  const modalProps = useReactive<ModalPropsType>({
    open: false,
    events: undefined
  })

  return (
    <>
      <Button
        key="playScreen"
        type="primary"
        onClick={async () => {
          const time = formRef?.current?.getFieldsValue()?.time
          const res = await getEchartMonitorList({
            startTime: time?.[0],
            endTime: time?.[1],
            type: EVENTTYPES.RECORDSCREEN,
            apikey: monitorContext?.apikeyType,
            recordScreenId: record?.recordScreenId
          })
          if (res?.code === 200) {
            modalProps.open = true
            modalProps.events = res?.data?.list?.[0]?.events
          }
        }}
      >
        播放录屏
      </Button>
      <Modal
        title="播放录屏"
        open={modalProps.open}
        destroyOnClose
        width={700}
        onCancel={() => (modalProps.open = false)}
        okButtonProps={{
          style: { display: 'none' }
        }}
      >
        <ScreenContainer modalProps={modalProps} />
      </Modal>
    </>
  )
}

export default PlayScreen

import { getMonitorScreen } from '@/apis/home'
import { Button, FormInstance, Modal } from 'antd'
import { useReactive } from 'ahooks'
import ScreenContainer from './screenContainer'

export type ModalPropsType = {
  open: boolean
  events?: string
}

const PlayScreen: React.FC<{
  record: any
  formRef: React.MutableRefObject<FormInstance<any> | undefined>
}> = ({ record }) => {
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
          const res = await getMonitorScreen({
            id: record?.recordScreenId
          })
          if (res?.code === 200) {
            modalProps.open = true
            modalProps.events = res?.data?.events
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

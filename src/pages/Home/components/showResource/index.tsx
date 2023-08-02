import { Button, Modal } from 'antd'
import { useReactive } from 'ahooks'
import ScreenContainer from './screenContainer'
import { findCodeBySourceMap } from '@/utils/monitor/sourcemap'
import { useContext } from 'react'
import { MonitorContext } from '../../context'

export type ModalPropsType = {
  open: boolean
  html?: string
}

const ShowResource: React.FC<{
  record: any
}> = ({ record }) => {
  const monitorContext = useContext(MonitorContext)
  const modalProps = useReactive<ModalPropsType>({
    open: false,
    html: undefined
  })

  return (
    <>
      <Button
        key="playScreen"
        type="primary"
        onClick={async () => {
          findCodeBySourceMap(monitorContext.apikeyType || '', record, res => {
            modalProps.open = true
            modalProps.html = res
          })
        }}
      >
        查看源码
      </Button>
      <Modal
        title="查看源码"
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

export default ShowResource

import { useEffect, useRef } from 'react'
import 'rrweb-player/dist/style.css'
import { ModalPropsType } from '..'
import styles from './index.module.less';

const ScreenContainer: React.FC<{ modalProps: ModalPropsType }> = ({ modalProps }) => {
  const screenCanvasRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (modalProps.open && modalProps.html && screenCanvasRef?.current) {
      screenCanvasRef.current.innerHTML = modalProps.html || ''
    }
  }, [modalProps.open, screenCanvasRef?.current])

  return <div className={styles.contianer} ref={screenCanvasRef} />
}

export default ScreenContainer

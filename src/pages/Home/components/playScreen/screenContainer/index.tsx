import { useEffect, useRef } from 'react'
import rrwebPlayer from 'rrweb-player'
import 'rrweb-player/dist/style.css'
import { unzip } from '@/utils/monitor/recordScreen'
import { ModalPropsType } from '..'

const ScreenContainer: React.FC<{ modalProps: ModalPropsType }> = ({ modalProps }) => {
  const screenCanvasRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (modalProps.open && modalProps.events && screenCanvasRef?.current) {
      new rrwebPlayer({
        target: screenCanvasRef?.current,
        props: {
          events: unzip(modalProps.events),
          UNSAFE_replayCanvas: true,
          width: 600,
          height: 300
        }
      })
    }
  }, [modalProps.open, screenCanvasRef?.current])

  return <div id="screenCanvas" ref={screenCanvasRef} style={{ width: 600, height: 400 }} />
}

export default ScreenContainer

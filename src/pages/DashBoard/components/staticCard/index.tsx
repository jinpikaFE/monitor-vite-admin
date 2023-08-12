import { ProCard, Statistic } from '@ant-design/pro-components'
import RcResizeObserver from 'rc-resize-observer'
import { useContext, useState } from 'react'
import CountUp from 'react-countup'

import styles from './index.module.less'
import { useAsyncEffect } from 'ahooks'
import { getStatistList } from '@/apis/dashBoard'
import { DashBoardContext } from '../../context'

const formatter = (value: number) => <CountUp end={value} separator="," />

const StaticCard = () => {
  const dashBoardContext = useContext(DashBoardContext)
  const [responsive, setResponsive] = useState(false)
  const [staticInfo, setStaticInfo] = useState<any>()

  useAsyncEffect(async () => {
    const res = await getStatistList({
      startTime: dashBoardContext?.rangeTime?.[0],
      endTime: dashBoardContext?.rangeTime?.[1]
    })
    if (res?.code === 200) {
      setStaticInfo(res?.data)
    }
  }, [dashBoardContext])

  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={offset => {
        setResponsive(offset.width < 596)
      }}
    >
      <ProCard.Group
        title="核心指标"
        direction={responsive ? 'column' : 'row'}
        ghost
        gutter={[16, 16]}
        className={styles.container}
      >
        <ProCard>
          <p className={styles.num}>{formatter(staticInfo?.uvNum)}</p>
          <p className={styles.title}>UV</p>
        </ProCard>
        <ProCard>
          <p className={styles.num}>{formatter(staticInfo?.pvNum)}</p>
          <p className={styles.title}>PV</p>
        </ProCard>
      </ProCard.Group>
    </RcResizeObserver>
  )
}

export default StaticCard

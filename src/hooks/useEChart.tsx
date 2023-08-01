import { useEffect } from 'react'
import * as echarts from 'echarts'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import 'echarts-liquidfill'
import 'echarts-wordcloud'

function useEChart(
  chartRef: React.MutableRefObject<HTMLElement | any>,
  options: echarts.EChartsOption,
  renderEcharts$?: EventEmitter<void>
) {
  let myChart: any = null
  function renderChart() {
    setTimeout(() => {
      const chart = echarts?.getInstanceByDom(chartRef?.current)
      if (chart) {
        myChart = chart
      } else {
        myChart = echarts.init(chartRef?.current)
      }
      myChart.setOption(options)
      myChart.on('click', function (params: any) {
        if (params?.componentSubType === 'wordCloud') {
          console.log(params?.data)
        }
      })
    })
  }

  if (renderEcharts$) {
    renderEcharts$.useSubscription(() => {
      myChart.dispose()
      renderChart()
    })
  }

  useEffect(() => {
    renderChart()
  }, [options])

  const resizeFn = () => {
    myChart?.resize()
  }

  useEffect(() => {
    window.addEventListener('resize', resizeFn)
    return () => {
      if (myChart) {
        myChart.dispose()
      }
      window.removeEventListener('resize', resizeFn)
    }
  }, [])

  return
}

export default useEChart

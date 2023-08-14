import { useEffect } from 'react'
import styles from './index.module.less'

const AmapCard = () => {
  useEffect(() => {
    ;(window as any).movingDraw = true
    const map = new window.AMap.Map('map', {
      viewMode: '3D', // 默认使用 2D 模式
      zoom: 5, //初始化地图层级
      pitch: 55,
      center: [103.594884, 36.964587], //初始化地图中心点
      mapStyle: 'amap://styles/925cf3179dae64c8ddece69383f630a5'
    })

    const loca = new window.Loca.Container({
      map
    })
    loca.ambLight = {
      intensity: 0.7,
      color: '#7b7bff'
    }
    loca.dirLight = {
      intensity: 0.8,
      color: '#fff',
      target: [0, 0, 0],
      position: [0, -1, 1]
    }
    loca.pointLight = {
      color: 'rgb(240,88,25)',
      position: [112.028276, 31.58538, 2000000],
      intensity: 3,
      // 距离表示从光源到光照强度为 0 的位置，0 就是光不会消失。
      distance: 5000000
    }

    const pl = new window.Loca.PrismLayer({
      zIndex: 10,
      opacity: 1,
      visible: false,
      hasSide: true
    })

    /** 加载数据 */
    const geo = new window.Loca.GeoJSONSource({
      url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/gdp.json'
    })
    pl.setSource(geo)
    // top3 的城市增加文字
    const topConf: any = {
      上海市: 'https://a.amap.com/Loca/static/loca-v2/demos/images/top-one.png',
      北京市: 'https://a.amap.com/Loca/static/loca-v2/demos/images/top-two.png',
      广州市: 'https://a.amap.com/Loca/static/loca-v2/demos/images/top-three.png'
    }
    pl.setStyle({
      unit: 'meter',
      sideNumber: 4,
      topColor: (index: any, f: any) => {
        const n = f.properties['GDP']
        return n > 7000 ? '#E97091' : '#2852F1'
      },
      sideTopColor: (index: any, f: any) => {
        const n = f.properties['GDP']
        return n > 7000 ? '#E97091' : '#2852F1'
      },
      sideBottomColor: '#002bb9',
      radius: 15000,
      height: (index: any, f: any) => {
        const props = f.properties
        const height = Math.max(100, Math.sqrt(props['GDP']) * 9000 - 50000)
        const conf = topConf[props['名称']]
        // top3 的数据，增加文字表达
        if (conf) {
          map.add(
            new window.AMap.Marker({
              anchor: 'bottom-center',
              position: [f.coordinates[0], f.coordinates[1], height],
              content:
                '<div style="margin-bottom: 10px; float: left; font-size: 14px;height: 57px; width: 180px; color:#fff; background: no-repeat url(' +
                conf +
                '); background-size: 100%;"><p style="margin: 7px 0 0 35px; height: 20px; line-height:20px;">' +
                props['名称'] +
                '人口 ' +
                props['人口'] +
                '</p>' +
                '<p style="margin: 4px 0 0 35px; height: 20px; line-height:20px; color: #00a9ff; font-size: 13px;">' +
                props['GDP'] +
                ' 元' +
                '</p></div>'
            })
          )
        }
        return height
      },
      rotation: 360,
      altitude: 0
    })
    loca.add(pl)
    map.on('complete', function () {
      setTimeout(function () {
        pl.show(500)
        pl.addAnimate({
          key: 'height',
          value: [0, 1],
          duration: 500,
          easing: 'Linear',
          transform: 2000,
          random: true,
          delay: 8000
        })
        pl.addAnimate({
          key: 'rotation',
          value: [0, 1],
          duration: 500,
          easing: 'Linear',
          transform: 2000,
          random: true,
          delay: 8000
        })
      }, 800)
    })
    loca.animate.start()

    // const dat = new window.Loca.Dat()
    // dat.addLayer(pl, 'GDP')

    // dat.addLight(loca.ambLight, loca, '环境光')
    // dat.addLight(loca.dirLight, loca, '平行光')
    // dat.addLight(loca.pointLight, loca, '点光')

    // 事件处理
    const clickInfo = new window.AMap.Marker({
      anchor: 'bottom-center',
      position: [116.396923, 39.918203, 0]
    })
    clickInfo.setMap(map)
    clickInfo.hide()
    // 鼠标事件
    map.on('mousemove', function (e: any) {
      const feat = pl.queryFeature(e.pixel.toArray())
      if (feat) {
        clickInfo.show()
        const props = feat.properties
        const height = Math.max(100, Math.sqrt(props['GDP']) * 9000 - 50000)
        clickInfo.setPosition([feat.coordinates[0], feat.coordinates[1], height])
        clickInfo.setContent(
          '<div style="text-align: center; height: 20px; width: 150px; color:#fff; font-size: 14px;">' +
            feat.properties['名称'] +
            ': ' +
            feat.properties['GDP'] +
            ' 元</div>'
        )
      } else {
        clickInfo.hide()
      }
    })
  }, [])

  return (
    <div>
      <div id="map" className={styles.container}></div>
    </div>
  )
}

export default AmapCard

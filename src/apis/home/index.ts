import http from '@/server'

const VITE_MONITOR_URL = import.meta.env.VITE_MONITOR_URL

export async function getMonitorList(params: Partial<Monitor.MonitorParams> & Global.PageParams) {
  return http.request({
    url: '/v1/mgb/monitor',
    method: 'get',
    params,
    baseURL: VITE_MONITOR_URL
  })
}

export async function getEchartMonitorList(params: Partial<Monitor.MonitorParams>) {
  return http.request({
    url: '/v1/monitor/echart',
    method: 'get',
    params,
    baseURL: VITE_MONITOR_URL
  })
}

export async function getMonitorScreen(params: { id: string }) {
  return http.request({
    url: `/v1/mgb/monitor/screen/${params?.id}`,
    method: 'get',
    baseURL: VITE_MONITOR_URL
  })
}

export async function getFileMap(data: { projectName: string; fileName: string }) {
  return http.request({
    url: '/api/v1/files/get',
    method: 'post',
    data
  })
}

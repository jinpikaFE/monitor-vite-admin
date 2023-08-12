import http from '@/server'

const VITE_MONITOR_URL = import.meta.env.VITE_MONITOR_URL

export async function getStatistList(params: DashBoardD.DashBoardParams) {
  return http.request({
    url: '/v1/mgb/monitor/statist',
    method: 'get',
    params,
    baseURL: VITE_MONITOR_URL
  })
}

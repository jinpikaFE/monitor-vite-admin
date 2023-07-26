import http from '@/server'

/** 获取apikeylist */
export async function getApikeyList() {
  return http.request({
    url: '/api/v1/monitor/monitorApikey/list',
    method: 'get'
  })
}

/** 添加apikey */
export async function creatApikey(data: Omit<Projects.ProjectsEntity, 'id'>) {
  return http.request({
    url: '/api/v1/monitor/monitorApikey/create',
    method: 'post',
    data
  })
}

/** 更新apikey */
export async function updateApikey(data: Projects.ProjectsEntity) {
  return http.request({
    url: `/api/v1/monitor/monitorApikey/${data?.id}`,
    method: 'put',
    data
  })
}

/** 删除apikey */
export async function delApikey(data: Pick<Projects.ProjectsEntity, 'id'>) {
  return http.request({
    url: `/api/v1/monitor/monitorApikey/${data?.id}`,
    method: 'delete'
  })
}

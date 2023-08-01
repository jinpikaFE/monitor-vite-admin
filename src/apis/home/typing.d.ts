declare namespace Monitor {
  type MonitorParams = {
    type: string
    apikey: string
    recordScreenId: string
    name: string
    // query tag是query参数别名，json xml，form适合post
    startTime: string
    endTime: string
  }
}

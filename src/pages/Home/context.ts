import React from 'react'

export type MonitorType = {
  apikeyType?: string
  rangeTime?: any
  username?: string
  uuid?: string
}

export const MonitorContext = React.createContext<MonitorType>({})

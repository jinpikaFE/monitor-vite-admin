/**
 * 事件类型
 */
export enum EVENTTYPES {
  API_ERR = 'apiErr',
  FETCH = 'fetch',
  CLICK = 'click',
  HISTORY = 'history',
  ERROR = 'error',
  HASHCHANGE = 'hashchange',
  UNHANDLEDREJECTION = 'unhandledrejection',
  RESOURCE = 'resource',
  DOM = 'dom',
  VUE = 'vue',
  REACT = 'react',
  CUSTOM = 'custom',
  /** 性能指标 */
  PERFORMANCE = 'performance',
  /** 录屏信息 */
  RECORDSCREEN = 'recordScreen',
  /** 白屏 */
  WHITESCREEN = 'whiteScreen',
  /** uv */
  UV = 'uv'
}

/** 性能指标名 */
export enum PERFORMANCE_TYPE {
  /** 上报长任务详情 */
  LongTask = 'longTask',
  /** 上报资源列表 */
  ResourceList = 'resourceList',
  /** 上报内存情况, safari、firefox不支持该属性 */
  Memory = 'memory',
  /** 首屏加载时间 */
  FSP = 'FSP',
  FCP = 'FCP',
  LCP = 'LCP',
  FID = 'FID',
  CLS = 'CLS',
  TTFB = 'TTFB'
}

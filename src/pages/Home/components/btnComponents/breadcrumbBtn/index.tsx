import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Button, Modal, Timeline } from 'antd'

const BreadcrumbBtn: React.FC<{ record: any }> = ({ record }) => {
  const onBehavior = () => {
    Modal.info({
      title: '查看用户行为',
      okText: '确定',
      cancelText: '取消',
      width: 600,
      content: (
        <Timeline
          style={{ marginTop: 16 }}
          items={record?.breadcrumb?.map((item: any) => {
            if (item.category === 'Click') {
              item.children = `用户点击dom: ${item.data}`
            } else if (item.category === 'Http') {
              item.children = `调用接口: ${item.data.url}, ${
                item.status === 'ok' ? '请求成功' : '请求失败'
              }`
            } else if (item.category === 'Code_Error') {
              item.children = `代码报错：${item.data.message}`
            } else if (item.category === 'Resource_Error') {
              item.children = `加载资源报错：${item.message}`
            } else if (item.category === 'Route') {
              item.children = `路由变化：从 ${item.data.from}页面 切换到 ${item.data.to}页面`
            }
            return {
              color: item.status === 'ok' ? '#5FF713' : '#F70B0B',
              dot: item.status === 'ok' ? <CheckCircleOutlined /> : <CloseCircleOutlined />,
              children: item.children
            }
          })}
        />
      )
    })
  }
  return (
    <Button key="behavior" onClick={() => onBehavior()} type="primary">
      查看用户行为
    </Button>
  )
}

export default BreadcrumbBtn

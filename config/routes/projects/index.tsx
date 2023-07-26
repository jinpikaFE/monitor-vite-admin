import Projects from '@/pages/Projects'
import { ProjectOutlined } from '@ant-design/icons'
import { Navigate } from 'react-router-dom'

export default {
  path: '/projects',
  name: '项目管理',
  icon: <ProjectOutlined />,
  permissionObj: true,
  children: [
    {
      path: '/projects',
      /** 重定向 */
      element: <Navigate replace to="/projects/list" />
    },
    {
      path: '/projects/list',
      name: '项目列表',
      permissionObj: true,
      element: <Projects />
    }
  ]
}

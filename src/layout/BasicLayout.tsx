import { storeGlobalUser } from '@/store/globalUser'
import { storage } from '@/utils/Storage'
import { PageContainer, ProLayout } from '@ant-design/pro-components'
import { RouteType, router } from '@config/routes'
import { useAsyncEffect } from 'ahooks'
import { Dropdown, MenuProps } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import defaultProps from '@/_defaultProps'
import Settings from '@config/defaultSettings'
import { observer } from 'mobx-react'
import React from 'react'

export enum ComponTypeEnum {
  MENU,
  PAGE,
  COMPON
}

export const GlobalUserInfo = React.createContext<Partial<User.UserEntity>>({})

const BasicLayout: React.FC = () => {
  const [pathname, setPathname] = useState(window.location.pathname)
  const navigate = useNavigate()
  const [showLayout, setShowLayout] = useState<boolean>(true)

  /** 处理菜单权限隐藏菜单 */
  const reduceRouter = (routers: RouteType[]): RouteType[] => {
    const authMenus = storeGlobalUser?.userInfo?.menus
      ?.filter(item => item?.type === ComponTypeEnum.MENU || item?.type === ComponTypeEnum.PAGE)
      ?.map(item => item?.title)

    return routers?.map(item => {
      if (item?.children) {
        const { children, ...extra } = item
        return {
          ...extra,
          routes: reduceRouter(item?.children),
          hideInMenu:
            item?.hideInMenu || !item?.children?.find(citem => authMenus?.includes(citem?.name))
        }
      }
      return {
        ...item,
        hideInMenu: item?.hideInMenu || !authMenus?.includes(item?.name)
      }
    }) as any
  }

  useEffect(() => {
    setPathname(window.location.pathname)
  }, [window.location.pathname])

  useAsyncEffect(async () => {
    if (pathname !== '/login') {
      await storeGlobalUser.getUserDetail()
    }
  }, [])

  const items: MenuProps['items'] = [
    {
      key: 'out',
      label: (
        <div
          onClick={() => {
            storage.clear()
            navigate('login', { replace: true })
          }}
        >
          退出登录
        </div>
      )
    }
  ]

  return (
    <GlobalUserInfo.Provider value={storeGlobalUser.userInfo}>
      {showLayout ? (
        <ProLayout
          {...defaultProps}
          route={reduceRouter(router?.routes)?.[1]}
          location={{
            pathname
          }}
          avatarProps={{
            src: storeGlobalUser.userInfo?.icon,
            size: 'small',
            title: <span style={{ color: '#fff' }}>{storeGlobalUser.userInfo?.username}</span>,
            render: (_, defaultDom) => {
              return <Dropdown menu={{ items }}>{defaultDom}</Dropdown>
            }
          }}
          menuFooterRender={props => {
            return (
              <div
                style={{
                  textAlign: 'center',
                  paddingBlockStart: 12
                }}
              >
                <div>© 2023 Made with love</div>
                <div>by JPK</div>
              </div>
            )
          }}
          menuRender={(props, defaultDom) => {
            if ((props?.layout as string) === 'hide') {
              setShowLayout(false)
              return null
            }
            return defaultDom
          }}
          menuProps={{
            onClick: ({ key }) => {
              navigate(key || '/')
            }
          }}
          colorPrimary="black"
          token={{
            colorBgAppListIconHover: 'rgba(30, 30, 30, 0.9)',
            colorTextAppListIconHover: '#ffffff',
            colorTextAppListIcon: '#ffffff',
            bgLayout: 'rgba(30, 30, 30, 0.9)',
            sider: {
              // 菜单背景颜色
              colorMenuBackground: 'transparent',
              // 侧边栏的标题字体颜色
              colorTextMenuTitle: '#fff',
              // menuItem 分割线的颜色
              colorMenuItemDivider: '#fff',
              // menuItem 的字体颜色
              colorTextMenu: '#fff',
              // menu 的二级字体颜色，比如 footer 和 action 的 icon
              colorTextMenuSecondary: '#fff',
              // menuItem 的选中字体颜色
              colorTextMenuSelected: '#fff',
              // menuItem hover 的选中字体颜色
              colorTextMenuActive: 'rgba(255,255,255, 0.85)',
              // menuItem 的 hover 字体颜色
              colorTextMenuItemHover: 'rgba(255,255,255,0.75)',
              // menuItem 的 hover 背景颜色
              colorBgMenuItemHover: 'rgba(90, 75, 75, 0.03)',
              // menuItem 的选中背景颜色
              colorBgMenuItemSelected: 'rgba(255,255,255, 0.04)',
              // 收起 menuItem 的弹出菜单背景颜色
              colorBgMenuItemCollapsedElevated: 'transparent',
              // 展开收起按钮背景颜色
              colorBgCollapsedButton: '#fff',
              // 展开收起按钮字体颜色
              colorTextCollapsedButton: 'colorTextMenuSecondary',
              // 展开收起按钮 hover 时字体颜色
              colorTextCollapsedButtonHover: 'colorTextMenu'
            },
            header: {
              // 菜单背景颜色
              colorBgHeader: 'rgba(30, 30, 30, 0.25)',
              // 侧边栏的标题字体颜色
              colorHeaderTitle: '#fff',
              // menuItem 分割线的颜色
              colorTextMenu: '#fff',
              // menu 的二级字体颜色，比如 footer 和 action 的 icon
              colorTextMenuSecondary: '#fff',
              // menuItem 的选中字体颜色
              colorTextMenuSelected: '#fff',
              // menuItem hover 的选中字体颜色
              colorTextMenuActive: 'rgba(255,255,255, 0.85)',
              // menuItem 的 hover 字体颜色
              colorBgMenuItemHover: 'rgba(255,255,255,0.75)',
              // menuItem 的 hover 背景颜色
              colorBgMenuItemSelected: 'rgba(90, 75, 75, 0.03)'
            }
          }}
          {...Settings}
        >
          <PageContainer>
            <Outlet />
          </PageContainer>
        </ProLayout>
      ) : (
        <Outlet />
      )}
    </GlobalUserInfo.Provider>
  )
}

export default observer(BasicLayout)

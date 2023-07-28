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
import styles from './basicLayout.module.less'

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
      <div className={styles.container}>
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
            token={{
              bgLayout: '#1E1E1F',
              colorTextAppListIcon: '#FFFFFF',
              colorTextAppListIconHover: 'rgba(244, 196, 109, 0.9)',
              colorBgAppListIconHover: 'rgba(244, 196, 109, 0.1)',
              sider: {
                colorTextMenuTitle: '#FFFFFF',
                colorTextMenu: '#FFFFFF',
                colorMenuItemDivider: '#FFFFFF',
                colorTextMenuSecondary: '#FFFFFF',
                colorTextMenuSelected: 'rgba(255, 171, 79, 1)',
                colorTextMenuActive: 'rgba(255, 171, 79, 0.85)',
                colorTextMenuItemHover: 'rgba(255, 171, 79, 0.65)',
                colorBgMenuItemHover: 'rgba(244, 196, 109, 0.1)',
                colorBgMenuItemSelected: 'rgba(244, 196, 109, 0.1)'
              },
              header: {
                colorBgHeader: '1E1E1F',
                colorHeaderTitle: '#FFFFFF',
                colorTextMenu: '#FFFFFF',
                colorTextMenuSecondary: '#FFFFFF',
                colorTextMenuSelected: 'rgba(255, 171, 79, 1)',
                colorTextMenuActive: 'rgba(255, 171, 79, 0.85)',
                colorTextRightActionsItem: 'rgba(255, 171, 79, 0.65)',
                colorBgMenuItemHover: 'rgba(244, 196, 109, 0.1)',
                colorBgMenuItemSelected: 'rgba(244, 196, 109, 0.1)',
                colorBgRightActionsItemHover: 'rgba(244, 196, 109, 0.1)'
              },
              pageContainer: {
                colorBgPageContainer: 'rgba(10, 10, 10, 1)'
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
      </div>
    </GlobalUserInfo.Provider>
  )
}

export default observer(BasicLayout)

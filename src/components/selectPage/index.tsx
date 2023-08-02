import React, { useEffect, useState } from 'react'
import type { FC } from 'react'
import { Divider, Pagination, Select, Space } from 'antd'
import type { SelectProps, PaginationProps } from 'antd'
import { useDebounceFn, useSetState } from 'ahooks'
import type { SetState } from 'ahooks/lib/useSetState'

export type TAsyncGetListObj = {
  setPageProps: SetState<PaginationProps>
  setOptions: React.Dispatch<React.SetStateAction<any[]>>
  pageProps: PaginationProps
  searchVal: string
}

export type TFormSelectPage = {
  /** SelectProps属性 */
  selectProps?: SelectProps
  /** 分页属性 */
  extraPageProps?: PaginationProps
  /** 获取数据并处理 */
  asyncGetList: (obj: TAsyncGetListObj) => void
  value?: any
  onChange?: any
}

const SelectPage: FC<TFormSelectPage> = props => {
  const { selectProps, extraPageProps, asyncGetList, value, onChange } = props

  const [searchVal, setSearchVal] = useState('')

  const [options, setOptions] = useState<any[]>([])

  /** 分页属性 */
  const [pageProps, setPageProps] = useSetState<PaginationProps>({
    current: 1,
    total: 0,
    pageSize: 20,
    pageSizeOptions: [20, 50, 100, 500],
    // showSizeChanger: true,
    showTotal: total => `总共 ${total} 项`,
    // pageSizeOptions: [11],
    size: 'small',
    ...extraPageProps
  })

  const { run } = useDebounceFn(
    () => {
      asyncGetList({ setPageProps, setOptions, pageProps, searchVal })
    },
    {
      wait: 500
    }
  )

  const onPageChange = (current: number, pageSize: number) => {
    setPageProps({ current, pageSize })
  }

  useEffect(() => {
    run()
  }, [pageProps.current, pageProps.pageSize, searchVal])

  return (
    <Select
      mode="multiple"
      showSearch
      options={options}
      filterOption={false}
      searchValue={searchVal}
      value={value}
      showArrow
      onSearch={val => {
        setPageProps({ current: 1 })
        setSearchVal(val)
      }}
      onChange={val => onChange?.(val)}
      dropdownMatchSelectWidth={600}
      dropdownRender={menu => (
        <>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <Space align="center" style={{ padding: '0 8px 4px' }}>
            <Pagination {...pageProps} onChange={onPageChange} />
          </Space>
        </>
      )}
      {...selectProps}
    />
  )
}

export default SelectPage

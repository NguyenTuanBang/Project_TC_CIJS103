import { Tabs } from 'antd'
import React from 'react'
import { getUserFromLocalStorage } from '../../asset/AuthContext'

const Tab = ({ changeTag, curTag }) => {
  const  user  = getUserFromLocalStorage()
  const onChange = (val) => {
    changeTag(val)
  }

  const tabItemsUser = [
    {
      key: "All",
      value: "All",
    },
    {
      key: "Class",
      value: "Class",
    },
  ]
  const tabItemsNoneUser = [
    {
      key: "All",
      value: "All",
    },
  ]

  return (
    <>
      {user && (
        <Tabs
          activeKey={curTag}
          items={tabItemsUser.map(item => ({
            key: item.key,
            label: item.value
          }))}
          onChange={onChange}
        />
      )
      }
      {!user && (
        <Tabs
          activeKey={curTag}
          items={tabItemsNoneUser.map(item => ({
            key: item.key,
            label: item.value
          }))}
          onChange={onChange}
        />
      )
      }
    </>


  )
}

export default Tab

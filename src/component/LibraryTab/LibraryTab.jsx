import { Tabs } from 'antd'
import React from 'react'
import { getUserFromLocalStorage} from '../../asset/AuthContext'

const LibraryTab = ({ changeTag, curTag }) => {
    const  user  = getUserFromLocalStorage()
    const onChange = (val) => {
        changeTag(val)
    }

    const bookStatus = [
        {
            key: "All",
            value: "All",
        },
        {
            key: "Available",
            value: "Available",
        },
        {
            key: "Rented",
            value: "Rented",
        },
        {
            key: "My Books",
            value: "My Books",
        },
    ]

    return (
        <>
            <Tabs
                activeKey={curTag}
                items={bookStatus.map(item => ({
                    key: item.key,
                    label: item.value
                }))}
                onChange={onChange}
            />
        </>


    )
}

export default LibraryTab

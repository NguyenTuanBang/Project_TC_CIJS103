import React from 'react'
import Card from '../Card'

const ShowPost = ({posts}) => {
    const ListCard=posts.map((item, index)=>{
        return <Card posts={item} id={index}/>
    })
  return (
    <div>
        {ListCard}
    </div>
  )
}

export default ShowPost
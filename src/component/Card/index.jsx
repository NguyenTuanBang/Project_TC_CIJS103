
import React from 'react'
import { useNavigate } from 'react-router'

const Card = (props) => {
    const navigate=useNavigate();

    return (
    <div className="container border-t-2 border-black mb-5 p-4 bg-white shadow-md rounded">
      <h1 className="text-xl font-bold text-gray-800 mb-2">{props.posts.title}</h1>
      <div className="text-sm text-gray-600 mb-1">👤 {props.posts.owner}</div>
      <div className="text-sm text-gray-500 mb-3">📅 {props.posts.postedDate}</div>
      <p className="text-base text-gray-700">{props.posts.content}</p>
    </div>
    )
}

export default Card
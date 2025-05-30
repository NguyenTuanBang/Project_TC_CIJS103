import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Tab from '../../component/Tag'
import Navbar from '../../component/Nav/nav'
import { getUserFromLocalStorage } from '../../asset/AuthContext'
import ShowPost from '../../component/ShowPost'

const HomePage = () => {
  const [status, setStatus] = useState("All")
  const [posts, setPosts] = useState([])
  const user = getUserFromLocalStorage()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/posts')
        setPosts(response.data)
      } catch (error) {
        console.error("Error fetching posts:", error)
      }
    }
    fetchPosts()
  }, [])

  const filteredPosts = useMemo(() => {
    if (status === "All" || !user) return posts
    return posts.filter(post => post.status === status && post.Class === user.class)
  }, [status, posts, user])

  return (
    <>
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">
        Home Page
      </h1>
      <Tab changeTag={setStatus} curTag={status} />
      <ShowPost posts={filteredPosts} />
    </>
  )
}

export default HomePage

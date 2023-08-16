import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Routes, Route, Link} from "react-router-dom"

import Home from "./home.jsx"
import About from "./About.jsx"
import Best from "./Best.jsx"
import NearMe from "./NearMe.jsx"
import Submit from './Submit.jsx'
import SignUp from "./components/SignUp.jsx"
import Login from "./components/Login.jsx"
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import './CSS/app.css'
import AllBathrooms from './AllBathrooms.jsx'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(url, key)

function App() {
  const [users, setUsers] = useState([])
  const [bathrooms, setBathrooms] = useState([])
  const [reviews, setReviews] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    getUsers()
    getBathrooms()
    getReviews()
  }, [])

  async function getUsers() {
    async function fetchUsers () {
      const { data } = await supabase.from('users').select();
      return data
    }
    setUsers(await fetchUsers())
  }

  async function getBathrooms() {
    async function fetchBathrooms () {
      const { data } = await supabase.from('bathrooms').select();
      return data
    }
    setBathrooms(await fetchBathrooms())
  }

  async function getReviews() {
    const { data } = await supabase.from('reviews').select();
    setReviews(data)
  }

  console.log('render')

  return (
    <>
    <NavBar />
      <Routes>
        <Route path="/" element={<Home bathrooms={bathrooms} reviews={reviews}/>} />
        <Route path="/bathrooms" element={<AllBathrooms bathrooms={bathrooms} reviews={reviews} setBathrooms={setBathrooms} setReviews={setReviews}/>}/>
        <Route path="/about" element={<About />} />
        <Route path="/best" element={<Best bathrooms={bathrooms} reviews={reviews} setBathrooms={setBathrooms} setReviews={setReviews}/>} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/near-me" element={<NearMe bathrooms={bathrooms} reviews={reviews} setBathrooms={setBathrooms} setReviews={setReviews} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App

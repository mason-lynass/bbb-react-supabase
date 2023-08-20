import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { Routes, Route, Link } from "react-router-dom"

import Home from "./home.jsx"
import About from "./About.jsx"
import Best from "./Best.jsx"
import NearMe from "./NearMe.jsx"
import Submit from './Submit.jsx'
import Account from './Account.jsx'
import SignUp from "./components/SignUp.jsx"
import Login from "./Login.jsx"
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import './CSS/app.css'
import AllBathrooms from './AllBathrooms.jsx'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(url, key)

function App() {
  const [session, setSession] = useState(null)
  const [sessionSwitch, setSessionSwitch] = useState(false)
  const [users, setUsers] = useState([])
  const [profile, setProfile] = useState(null)
  const [bathrooms, setBathrooms] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  // initial loading of data from database
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setSessionSwitch(true)
      getUsers(session) // this function needs session to setProfile
    })

    // getBathrooms()
    // getReviews()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    
    return () => subscription.unsubscribe() // cleanup function
  }, [])

  async function getUsers(session) {
    async function fetchUsers() {
      const { data, error } = await supabase.from('users').select(); // get the data from Supabase
      if (session) setProfile(data.filter((user) => session.user.id === user.id)[0]) // setProfile by filtering the data
      return data
    }

    // this stuff is in here to try to load a session, then users, then set a profile
    // but I just moved the setProfile inside the fetchUsers(), using data instead of users, duh!
    // async function getProfile() {
    //   function returnSession() {
    //     console.log('returnSession')
    //     console.log(session)
    //     return new Promise((resolve, reject) => {
    //       if (session) {
    //         resolve('there is a session')
    //       } else {
    //         reject('no session')
    //       }
    //     })
    //   }

    //   const profileSession = await returnSession().then(
    //     setProfile(users.filter((user) => session.user.id === user.id))
    //   )
    // }

    setUsers(await fetchUsers())
    // getProfile()
    // setTimeout(() => getProfile(), 1000)
  }

  async function getBathrooms() {
    async function fetchBathrooms() {
      const { data, error } = await supabase.from('bathrooms').select();
      return data
    }
    setBathrooms(await fetchBathrooms())
  }

  async function getReviews() {
    const { data, error } = await supabase.from('reviews').select();
    setReviews(data)
  }

  // console.log(session, sessionSwitch)

  // console.log(session, users, reviews, bathrooms, profile)

  return (
    <>
      <NavBar session={session} sessionSwitch={sessionSwitch} />
      <Routes>
        <Route path="/" element={<Home bathrooms={bathrooms} reviews={reviews} />} />
        <Route path="/bathrooms" element={<AllBathrooms bathrooms={bathrooms} reviews={reviews} setBathrooms={setBathrooms} setReviews={setReviews} />} />
        <Route path="/about" element={<About />} />
        <Route path="/best" element={<Best bathrooms={bathrooms} reviews={reviews} setBathrooms={setBathrooms} setReviews={setReviews} />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/near-me" element={<NearMe bathrooms={bathrooms} reviews={reviews} setBathrooms={setBathrooms} setReviews={setReviews} />} />
        <Route path="/login" element={<Login supabase={supabase} users={users} session={session} setProfile={setProfile} profile={profile}/>} />
        <Route path="/account" element={<Account session={session} profile={profile} setProfile={setProfile} supabase={supabase} />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App

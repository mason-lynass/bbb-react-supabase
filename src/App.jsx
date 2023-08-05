import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import './App.css'

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
    const { data } = await supabase.from('users').select();
    setUsers(data)
  }

  async function getBathrooms() {
    const { data } = await supabase.from('bathrooms').select();
    setBathrooms(data)
  }

  async function getReviews() {
    const { data } = await supabase.from('reviews').select();
    setReviews(data)
  }

  console.log(users)

  return (
    <>
      <div>
        {users.map((user) => (
          <p key={user.username}>{user.username}</p>
        ))}
      </div>
      <div>
        {bathrooms.map((bathroom) => (
          <div key={bathroom.name}>
            <h2>{bathroom.location_name}</h2>
            <h3>{bathroom.address}</h3>
            <p>{bathroom.description}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default App

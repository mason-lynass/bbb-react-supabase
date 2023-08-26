import { useState, useEffect } from "react"
import { redirect, useNavigate } from "react-router-dom"
import { motion as m } from 'framer-motion'

import './CSS/Account.css'

export default function Account({ session, profile, setProfile, supabase }) {

    let navigate = useNavigate()

    console.log(profile)

    const [username, setUsername] = useState('')

    async function handleUsernameSubmit(e) {
        e.preventDefault()
        // this updates the username in the users table where the id === logged in user id
        const { error } = await supabase.from('users').update({ username: username }).eq('id', profile.id)
        // DB doesn't re-fetch (I think?), or there's a lag at least, so we update state
        setProfile({
            id: profile.id,
            email: profile.email,
            username: username
        })
    }

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        setProfile(null)
        navigate('/login')
    }

    if (profile) {
        // if you have a profile, but you don't have a username, you just haven't made one yet
        if (!profile.username) return (
            <main id='account'>
                <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <h2>Hi there, {profile.email}!</h2>
                    <h2>You don't have a username!</h2>
                    <form onSubmit={handleUsernameSubmit}>
                        <label htmlFor="username">Claim your username:</label>
                        <input id='username' name='username' autoComplete="username" type='username' value={username} onChange={(e) => setUsername(e.target.value)}></input>
                        <input type="submit" value='Submit'></input>
                    </form>
                    <div id='sign-out'>
                        <button onClick={signOut} >Sign Out</button>
                    </div>
                </m.div>
            </main>
        )

        else return (
            <main id='account'>
                <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <h2>Hi there, {profile.username}!</h2>
                    {/* it would be cool if there was a section for Bathrooms, Reviews, and Favorites */}
                    {/* and they each had their own sort of header that you could click on to open or hide the content */}
                    <div id='account-bathrooms'>
                        {/* this will change once we tie users to bathrooms */}
                        <h3>You've submitted 0 bathrooms:</h3>
                    </div>
                    <div id='account-reviews'>
                        {/* this will change once we tie users to reviews */}
                        <h3>You've submitted 0 reviews:</h3>
                    </div>
                    <div id='account-favorites'>
                        {/* this will change once we tie users to favorites */}
                        <h3>Here are your favorite bathrooms:</h3>
                    </div>
                    <div id='sign-out'>
                        <button onClick={signOut} >Sign Out</button>
                    </div>
                </m.div>
            </main>
        )
    }

    // if you don't have a profile, you're not supposed to end up here on the Account page,
    // you're only supposed to get to the account page if you have a profile
    else useEffect(() => navigate('/login'), [])


}
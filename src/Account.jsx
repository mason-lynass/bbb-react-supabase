import { useState } from "react"
import { redirect, useNavigate } from "react-router-dom"

import './CSS/Account.css'

export default function Account({ session, profile, setProfile, supabase }) {

    let navigate = useNavigate()

    const [username, setUsername] = useState('')

    function handleUsernameSubmit() {

    }

    // console.log(session, profile)

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        setProfile(null)
        navigate('/login')
    }

    if (profile) {
        console.log(profile)

        if (!profile.username) return (
            <main id='account'>
                    <h2>Hi there, {profile.email}!</h2>
                    <h2>You don't have a username!</h2>
                    <form onSubmit={handleUsernameSubmit()}>
                        <label htmlFor="username">Claim your username:</label>
                        <input id='username' name='username' autoComplete="username" type='username' value={username} onChange={(e) => setUsername(e.target.value)}></input>
                        <input type="submit" value='Submit'></input>
                    </form>
            </main>
        )

        else return (
            <main id='account'>
                <h2>Hi there, {profile.username}!</h2>
                <div>
                    <button onClick={signOut} >Sign Out</button>
                </div>
            </main>
        )
    }

    else return (
        <p>nothing!</p>
    )


}
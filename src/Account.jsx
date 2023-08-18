import { useState } from "react"

export default function Account({ session, profile, supabase }) {

    const [username, setUsername] = useState('')

    function handleUsernameSubmit() {

    }

    // console.log(session, profile)

    async function signOut() {
        const { error } = await supabase.auth.signOut()
    }

    if (profile) {
        console.log(profile)

        if (!profile.username) return (
            <div>
                <div>
                    <h2>Hi there, {profile.email}!</h2>
                    <h2>You don't have a username!</h2>
                    <form onSubmit={handleUsernameSubmit()}>
                        <label htmlFor="username">Claim your username:</label>
                        <input id='username' name='username' autoComplete="username" type='username' value={username} onChange={(e) => setUsername(e.target.value)}></input>
                        <input type="submit" value='Submit'></input>
                    </form>
                </div>
                
            </div>
        )

        else return (
            <div>
                <h2>Hi there, {profile.username}!</h2>
                <div>
                    <button onClick={signOut()} >Sign Out</button>
                </div>
            </div>
        )
    }

    else return (
        <p>nothing!</p>
    )


}
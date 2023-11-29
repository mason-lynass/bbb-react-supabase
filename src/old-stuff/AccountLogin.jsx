import { useState } from "react"
import { redirect, useNavigate } from "react-router-dom"

// !!!
// we are not using this because we are using the Auth component
// !!!
export default function AccountLogin({ hasAccount, setHasAccount, supabase, setProfile }) {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])

    async function handleLogin(e) {
        e.preventDefault
        let { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        setProfile(data.filter((user) => session.user.id === user.id)[0])
        navigate('./account')
        console.log('made it this far')
    }

    return (
        <div id='account-login'>
            <section>
                <h2>Login to your account:</h2>
                <form id='login-form' onSubmit={handleLogin}>
                    <label htmlFor='email'>Email address:</label>
                    <input id='email' autoComplete="email-address" name='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor='password'>Password:</label>
                    <input id='password' name='password' autoComplete="current-password" type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input id='submit' type='submit' value='Submit' />
                    {errors.map((err) => (
                        <p key={err}>{err}</p>)
                    )}
                </form>
                <div>
                    <p id='account-login-switch'>Don't have an account? </p><button onClick={() => setHasAccount(false)}>Sign up for a new one!</button>
                </div>
            </section>
        </div>
    )
}
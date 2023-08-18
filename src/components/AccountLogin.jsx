import { useState } from "react"

export default function AccountLogin({ hasAccount, setHasAccount, supabase }) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])

    async function handleLogin() {
        let { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
          })
    }

    return (
        <div id='account-login'>
            <section>
                <h2>Login to your account:</h2>
                <form id='login-form' onSubmit={handleLogin}>
                    <label htmlFor='email'>Email address:</label>
                    <input id='email' autoComplete="email-address" name='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor='password'>Password:</label>
                    <input id='password' name='password' autoComplete="current-password" type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <input id='submit' type='submit' value='Submit'/>
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
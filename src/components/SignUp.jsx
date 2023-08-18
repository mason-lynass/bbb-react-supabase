import { useState } from "react"

export default function SignUp({ setHasAccount, hasAccount, supabase }) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])

    async function handleSignUp (e) {
        e.preventDefault()
        let { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
          })
    }

    return (
        <div id='sign-up'>
            <section>
                <h2>Sign up for a new account:</h2>
                <form id='signup-form' onSubmit={handleSignUp}>
                    <label htmlFor='email'>Email address:</label>
                    <input id='email' autoComplete="email-address" name='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor='password'>Password:</label>
                    <input id='password' name='password' autoComplete="current-password" type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <input id='submit' type='submit' value='Submit'/>
                    {errors.map((err) => (
                    <p key={err}>{err}</p>)
                    )}
                </form>
                {/* this might be a plug-in or readymade form from Supabase */}
                <div>
                    <p id='account-login-switch'>already have an account?</p>
                    <button onClick={() => setHasAccount(true)}>Login to an existing account</button>
                </div>
            </section>
        </div>
    )
}
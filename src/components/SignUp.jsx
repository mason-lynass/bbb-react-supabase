export default function SignUp({ setHasAccount, hasAccount }) {
    return (
        <div id='sign-up'>
            <section>
                <h2>Sign up for a new account:</h2>
                {/* this might be a plug-in or readymade form from Supabase */}
                <div>
                    <p id='account-login-switch'>already have an account?</p>
                    <button onClick={() => setHasAccount(true)}>Login to an existing account</button>
                </div>
            </section>
        </div>
    )
}
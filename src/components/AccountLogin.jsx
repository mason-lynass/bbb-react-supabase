export default function AccountLogin({ hasAccount, setHasAccount }) {
    return (
        <div id='account-login'>
            <section>
                <h2>Login to your account:</h2>
                <div>
                    <p id='account-login-switch'>Don't have an account? </p><button onClick={() => setHasAccount(false)}>Sign up for a new one!</button>
                </div>
            </section>
        </div>
    )
}
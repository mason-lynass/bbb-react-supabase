import AccountLogin from "./components/AccountLogin";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import SignUp from "./components/SignUp";
import { useState } from "react";
import "./CSS/Login.css"
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared"

export default function Login({ supabase, session }) {

    const [hasAccount, setHasAccount] = useState(false)

    if (!session) return (
        <div id='Auth'>
            <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />
        </div>
    )

    else return (
        <div id='login'>
            <main>
                {hasAccount ?
                    <AccountLogin hasAccount={hasAccount} setHasAccount={setHasAccount} supabase={supabase} />
                    :
                    <SignUp hasAccount={hasAccount} setHasAccount={setHasAccount} supabase={supabase} />
                }
            </main>
        </div>
    )
}
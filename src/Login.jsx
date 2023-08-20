import AccountLogin from "./components/AccountLogin";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import SignUp from "./components/SignUp";
import { useState } from "react";
import "./CSS/Login.css"
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { useNavigate } from "react-router-dom";

export default function Login({ supabase, session, setProfile, profile, users }) {

    const navigate = useNavigate()

    const [hasAccount, setHasAccount] = useState(false)

    console.log(session, profile)

    if (!session) return (
        <div id='Auth'>
            <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />
        </div>
    )

    if (session && !profile) {
        try {
            setProfile(users.filter((user) => session.user.id === user.id)[0])
            navigate("/account")
        }
        catch {
            console.log('uh oh!')
        }
    }

    else return (<p>uh oh!</p>)

    // this doesn't work
    // if (session && profile) navigate("/account")

    // else return (
    //     <div id='login'>
    //         <main>
    //             {hasAccount ?
    //                 <AccountLogin hasAccount={hasAccount} setHasAccount={setHasAccount} supabase={supabase} setProfile={setProfile} />
    //                 :
    //                 <SignUp hasAccount={hasAccount} setHasAccount={setHasAccount} supabase={supabase} />
    //             }
    //         </main>
    //     </div>
    // )
}
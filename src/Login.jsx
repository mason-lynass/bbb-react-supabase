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

    // const [hasAccount, setHasAccount] = useState(false)

    console.log(session, profile)

    // if there's no session, then you need to log in
    if (!session) return (
        <div id='Auth'>
            {/* // it would be nice if I could add some functionality to this component but I don't think that I can */}
            {/* // like it would be nice to do everything else in the if statements here */}
            <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />
        </div>
    )

    // if there is a session, then that means you must have been here before
    if (session && !profile) {
        try {
            // this is what happens if you log in, because there's already a user created
            setProfile(users.filter((user) => session.user.id === user.id)[0])
            // this is what happens when you sign up, because the user takes a split second to be created in the DB,
            // and we're not re-fetching the users, so the user doesn't exist
            if (!profile) {
                setProfile({
                    username: null,
                    email: session.user.email,
                    id: session.user.id
                })
            }
        }
        catch {
            console.log('uh oh!')
        }
    }

    // I don't like this, but you can't re-render a component and update higher-level state at the same time, so I delayed the re-render a little bit.
    if (session && profile) setTimeout(() => navigate("/account"), 100)

    else return (<p>uh oh!</p>)

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
import AccountLogin from "./AccountLogin";
import Footer from "./Footer";
import NavBar from "./NavBar";
import SignUp from "./SignUp";
import { useState } from "react";
import "../CSS/Login.css"

export default function Login () {

    const [hasAccount, setHasAccount] = useState(false)

    return (
        <div id='login'>
            <main>
                {hasAccount ? <AccountLogin hasAccount={hasAccount} setHasAccount={setHasAccount}/> : <SignUp hasAccount={hasAccount} setHasAccount={setHasAccount}/>}
            </main>
        </div>
    )
}
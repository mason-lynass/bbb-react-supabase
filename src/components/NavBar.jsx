import { Link } from "react-router-dom"

export default function NavBar({ session, sessionSwitch }) {

    function loginAccount () {
        // console.log(session, sessionSwitch)
        if (!session) return <Link id='login' to='/login' ><p id='underline'>Log In</p><p>Sign Up</p></Link>
        else if (session.length === 0) return <Link id='login' to='/login' ><p id='underline'>Log In</p><p>Sign Up</p></Link>
        else return <Link to='/account' >Account</Link> 
    }

    return (
        <div id="nav-bar">
            <Link to='/'><h1 id='nav-title'>Better Bathroom Bureau</h1></Link>
            <nav>
                <div>

                    <Link to='/bathrooms' >All Bathrooms</Link>
                    <Link to='/best' >Best New Bathrooms</Link>
                    <Link to='/near-me' >Bathrooms Near Me</Link>
                    <Link to='/submit' >Submit a Bathroom</Link>
                    <Link to='/about' >Our Mission</Link>
                </div>
                <div>
                    {loginAccount()}
                </div>
            </nav>
        </div>
    )
}
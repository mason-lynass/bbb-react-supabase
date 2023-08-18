import { Link } from "react-router-dom"

export default function NavBar({ session }) {

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
                    {(session && session.length === 0) ? 
                    <Link id='login' to='/login' ><p id='underline'>Log In</p><p>Sign Up</p></Link>
                    :
                    <Link to='/account' >Account</Link> 
                    }
                </div>
            </nav>
        </div>
    )
}
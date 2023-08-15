import { Link } from "react-router-dom"

export default function NavBar() {
    return (
        <div id="nav-bar">
            <h1 id='nav-title'>Better Bathroom Bureau</h1>
            <nav>
                <div>
                    <Link to='/about' >Our Mission</Link>
                    <Link to='/best' >Best New Bathrooms</Link>
                    <Link to='/submit' >Submit a Bathroom</Link>
                    <Link to='/near-me' >Bathrooms Near Me</Link>
                </div>
                <div>
                    <Link id='login' to='/login' ><p id='underline'>Log In</p><p>Sign Up</p></Link>
                </div>
            </nav>
        </div>
    )
}
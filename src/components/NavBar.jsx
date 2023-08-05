import { Link } from "react-router-dom"

export default function NavBar() {
    return (
        <div>
            <h1>Better Bathroom Bureau</h1>
            <nav>
                <div>
                    <Link to='/' >Our Mission</Link>
                    <Link to='/' >Best New Bathrooms</Link>
                    <Link to='/' >Submit a Bathroom</Link>
                    <Link to='/' >Bathrooms Near Me</Link>
                </div>
                <div>
                    <Link to='/' >Log In</Link>
                    <Link to='/' >Sign Up</Link>
                </div>
            </nav>
        </div>
    )
}
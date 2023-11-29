import { Link } from "react-router-dom";

export default function NoBathroomFound ({bathroomID}) {
    return (
        <div id='no-bathroom-found'>
            <p>A bathroom with an id of {bathroomID} does not exist in our database.</p>
            <Link to='/bathrooms' >back to All Bathrooms</Link>
        </div>
    )
}
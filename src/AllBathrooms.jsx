import './CSS/AllBathrooms.css'
import { motion as m } from 'framer-motion'

export default function AllBathrooms({ bathrooms, reviews }) {

    function allTheBathrooms() {
        return (
            <div id='all-bathrooms'>
                {bathrooms.map((bathroom) => (
                    <div class='one-bathroom-all' id={bathroom.name} key={bathroom.name}>
                        <h2>{bathroom.location_name}</h2>
                        <h3>{bathroom.address}</h3>
                        <p>{bathroom.description}</p>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {bathrooms !== undefined ? allTheBathrooms() : <h2>loading...</h2>}
        </m.div>
    )
}
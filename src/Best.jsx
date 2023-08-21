import { useEffect, useState } from 'react'

import './CSS/Best.css'
import BestBathroom from './components/BestBathroom'

export default function Best({ bathrooms, reviews }) {
    const [loaded, setLoaded] = useState(false)
    const [best, setBest] = useState([])

    // the length in the dependency array should only change from null -> all of the bathrooms
    useEffect(() => {
        setBest(bathrooms)
        if (bathrooms.length > 0) {
            // change this to filter best bathrooms and not public ones
            setBest([...bathrooms].filter((bathroom) => bathroom.public === true).sort((a,b) => Date.parse(b.created_at) - Date.parse(a.created_at)))
            setLoaded(true)
        }
    }, [bathrooms.length])

    function bestBathrooms() {
        return (
            <div id='best-bathrooms'>
                {best.map((bathroom) => {
                    return (
                        <BestBathroom bathroom={bathroom} />
                    )
                })}
            </div>
        )
    }

    return (
        <>
            {(loaded === true) ? bestBathrooms() : <h2>loading...</h2>}
        </>
    )
}
import './CSS/AllBathrooms.css'

export default function AllBathrooms ({bathrooms, reviews}) {

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
        <>
            {bathrooms !== undefined ? allTheBathrooms() : <h2>loading...</h2>}
        </>
    )
}
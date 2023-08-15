export default function Home({ bathrooms, reviews }) {

    function allBathrooms() {
        return (
            <div id='all-bathrooms'>
                {bathrooms.map((bathroom) => (
                    <div key={bathroom.name}>
                        <h2>{bathroom.location_name}</h2>
                        <h3>{bathroom.address}</h3>
                        <p>{bathroom.description}</p>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div id='home'>
            <main id='home-main'>
                {bathrooms !== undefined ? allBathrooms() : <h2>loading...</h2>}
            </main>
        </div>
    )
}
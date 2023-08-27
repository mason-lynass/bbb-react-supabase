export default function BestBathroom({bathroom}) {

    return (
        <div id={bathroom.name} className='one-bathroom-stock' key={bathroom.name}>
            <h2>{bathroom.location_name}</h2>
            <h3>{bathroom.address}</h3>
            <p>{bathroom.description}</p>
        </div>
    )
}
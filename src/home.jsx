import { motion as m } from 'framer-motion'
import { useLoaderData } from 'react-router-dom'

export default function Home() {

    // for this page I was thinking it would be nice to see:

    // "Welcome to the Better Bathroom Bureau"
    // a link to the app on the App Store, something like "on the go? get the app!"
    // a brief description of what BBB is - something like the text on the Mission page
    // one bathroom - maybe the most recently submitted, or the highest rated, or the closest to you?
    // one review - maybe the most recent, or something specific that we choose?
    // mayyyyybe a map with all of the bathrooms on it as pins? might be an expensive feature if we load a map and all the pins every homepage visit

    const loaderData = useLoaderData()

    const bathrooms = loaderData[0]
    const reviews = loaderData[1]

    return (
        <main id='home-main'>
            <m.div id='home'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >

                <h1>you're on the home page babes</h1>

            </m.div>
        </main>
    )
}
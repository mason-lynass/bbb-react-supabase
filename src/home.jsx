import { motion as m } from 'framer-motion'

export default function Home({ bathrooms, reviews }) {



    return (
        <m.div id='home'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <main id='home-main'>
                <h1>you're on the home page babes</h1>
            </main>
        </m.div>
    )
}
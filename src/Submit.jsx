import { motion as m } from 'framer-motion'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from "@supabase/auth-ui-shared"
import BathroomForm from './components/BathroomForm'
import './CSS/Submit.css'
import { useLoaderData } from 'react-router-dom'

// we need to make something that checks to see if there's a logged in user
// because you have to be logged in to submit a bathroom

export default function Submit ({ setBathrooms}) {

    const loaderData = useLoaderData();
    const bathrooms = loaderData[0]
    let profile = loaderData[1]
    const GMKey = loaderData[2]
    const supabase = loaderData[3]

    console.log(loaderData[1])

    if (!profile) {
        return (
            <m.div id='Auth' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h2 style={{textAlign: "center"}}>Please log in to submit a bathroom.</h2>
            <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />
        </m.div>
        )
    }

    else return (
        <m.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.5}}>
             <main id='submit'>
                <h1 id='submit-bathroom-title'>Add a new bathroom</h1>
                <BathroomForm bathrooms={bathrooms} setBathrooms={setBathrooms} profile={profile} GMKey={GMKey} supabase={supabase}/>
             </main>
        </m.div>
    )
}
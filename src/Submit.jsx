import { motion as m } from 'framer-motion'
import BathroomForm from './components/BathroomForm'
import './CSS/Submit.css'

export default function Submit ({profile, bathrooms, setBathrooms, GMKey, supabase}) {
    return (
        <m.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.5}}>
             <main id='submit'>
                <h1 id='submit-bathroom-title'>Add a new bathroom</h1>
                <BathroomForm bathrooms={bathrooms} setBathrooms={setBathrooms} profile={profile} GMKey={GMKey} supabase={supabase}/>
             </main>
        </m.div>
    )
}
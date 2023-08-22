import { motion as m } from 'framer-motion'

export default function Submit () {
    return (
        <m.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.5}}>
             <main></main>
        </m.div>
    )
}
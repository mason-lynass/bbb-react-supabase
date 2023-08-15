import NavBar from "./components/NavBar"
import Footer from "./components/Footer"

export default function Home() {
    return (
        <div>
            <NavBar />
            <main>
                <div>this is the main content</div>
            </main>
            <Footer></Footer>
        </div>
    )
}
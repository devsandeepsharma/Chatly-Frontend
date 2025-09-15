import AuthHeader from "../components/layout/AuthHeader";
import Footer from "../components/layout/Footer";

const Landing = () => {
    return (
        <>
            <AuthHeader />
            <h1 className="text-2xl text-green-600">Landing Page</h1>
            <Footer />
        </>
    )
}

export default Landing;
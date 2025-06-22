import CFP from "../components/layout/CFP";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ConferenceHeader from "../components/header/ConferenceHeader";



const CallForPaper = () => {
    return (
        <>
            <Header />
            <main className="pt-20" >
                <CFP />
            </main>
            <Footer />
        </>
    );
};

export default CallForPaper;
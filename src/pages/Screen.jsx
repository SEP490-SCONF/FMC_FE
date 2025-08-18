import React from "react";
import HomeScreen from "../components/layout/HomeScreen";
import NewsAndSponsorPage from "../components/layout/NewsASponsor";
import { useConference, ConferenceProvider } from "../context/ConferenceContext";
import LoadingSpinner from "../components/common/LoadingSpinner";

const ScreenContent = () => {
    const { conferences, loading } = useConference();

    if (loading) return <LoadingSpinner />;

    return (
        <main className="pt-20">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-8">
                        <HomeScreen conferences={conferences} loading={loading} />
                    </div>
                    <div className="col-lg-4">
                        <NewsAndSponsorPage />
                    </div>
                </div>
            </div>
        </main>
    );
};

const Screen = () => (
    <ConferenceProvider>
        <ScreenContent />
    </ConferenceProvider>
);

export default Screen;

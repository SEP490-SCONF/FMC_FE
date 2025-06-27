import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Banner from "../components/layout/Banner";
import Event from "../components/layout/Event";
import Faq from "../components/layout/Faq";
import Schedule from "../components/layout/schedule";
import Service from "../components/layout/Service";
import Solution from "../components/layout/Solution";
import HomeBody from "../components/layout/HomeScreen";
import { getConferenceById } from "../Service/ConferenceService";

const Home = () => {
    const { id } = useParams();
    const [selectedConference, setSelectedConference] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const data = await getConferenceById(id);
                    setSelectedConference(data);
                    console.log("Selected Conference:", data);
                } catch (error) {
                    setSelectedConference(null);
                }
            };
            fetchData();
        }
    }, [id]);

    return (
        <>
            <main className="pt-20">
                <Banner conference={selectedConference} />
                <Service />
                <Event />
                <Schedule conference={selectedConference} />
                <Solution />
                <Faq />
                {/* Không cần truyền onConferenceSelect nữa */}
                {/* <HomeBody onConferenceSelect={handleConferenceSelect} /> */}
            </main>
        </>
    );
};

export default Home;
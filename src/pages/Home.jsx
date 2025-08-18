import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import Banner from "../components/layout/Banner";
import Event from "../components/layout/Event";
import Faq from "../components/layout/Faq";
import Schedule from "../components/layout/schedule";
import Service from "../components/layout/Service";
import Solution from "../components/layout/Solution";
import HomeBody from "../components/layout/HomeScreen";
import TechMarquee from "../components/layout/Marque";
import { getConferences, getConferenceById } from "../services/ConferenceService";
import { getConferenceTopicsByConferenceId } from "../services/ConferenceTopicService";

const Home = () => {
    const { id } = useParams();
    const [selectedConference, setSelectedConference] = useState(null);
    const [topics, setTopics] = useState([]);
    const [loadingTopics, setLoadingTopics] = useState(false);
    const navigate = useNavigate(); // Thêm dòng này

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const data = await getConferenceById(id);
                    if (!data) {
                        navigate("/not-found"); // Chuyển hướng nếu không tìm thấy
                        return;
                    }
                    setSelectedConference(data);
                    console.log("Selected Conference:", data);
                } catch (error) {
                    setSelectedConference(null);
                    navigate("/not-found"); // Chuyển hướng nếu lỗi
                }
            };
            fetchData();
        }
    }, [id, navigate]);

    useEffect(() => {
        if (selectedConference?.conferenceId) {
            setLoadingTopics(true);
            const fetchTopics = async () => {
                try {
                    const topicsData = await getConferenceTopicsByConferenceId(selectedConference.conferenceId);
                    setTopics(topicsData);
                } finally {
                    setLoadingTopics(false);
                }
            };
            fetchTopics();
        }
    }, [selectedConference]);

    // Hàm nhận id và gọi API lấy chi tiết conference
    const handleConferenceSelect = async (conferenceId) => {
        try {
            const data = await getConferenceById(conferenceId);
            setSelectedConference(data);
        } catch (error) {
            setSelectedConference(null);
        }
    };

    return (
        <>
            <main>
                <Banner conference={selectedConference} />
                <Service conference={selectedConference} topics={topics} />
                <Event />
                <Schedule conference={selectedConference} />
                <Solution />
                <Faq />
                <TechMarquee />
            </main>
        </>
    );
};

export default Home;
import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import Banner from "../../components/conference/ConferenceBanner";

import Schedule from "../../components/conference/ConferenceSchedule";
import Service from "../../components/conference/ConferenceTopic";

import { getConferences, getConferenceById } from "../../services/ConferenceService";
import { getConferenceTopicsByConferenceId } from "../../services/ConferenceTopicService";


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

    
    return (
        <>
            <main>
                <Banner conference={selectedConference} />
                <Service conference={selectedConference} topics={topics} />
                
                <Schedule conference={selectedConference} />
               
            </main>
        </>
    );
};

export default Home;
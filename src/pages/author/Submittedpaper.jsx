import React, { useEffect, useState } from "react";
import Submited from "../../components/layout/Submited";
import { getPapersByUserAndConference } from "../../services/PaperSerice";
import { useUser } from "../../context/UserContext";
import { useParams } from "react-router-dom";

const SubmittedPaperAuthor = () => {
    const { user } = useUser();
    const { conferenceId } = useParams();
    const [papers, setPapers] = useState([]);

    useEffect(() => {
        console.log("user:", user, "conferenceId:", conferenceId);
        if (user && conferenceId) {
            getPapersByUserAndConference(user.userId, conferenceId)
                .then(res => {
                    console.log("API response:", res); // In ra kết quả trả về
                    setPapers(res.data || res);
                })
                .catch(() => setPapers([]));
        }
    }, [user, conferenceId]);

    return (
        <main>
            <Submited submissions={papers} />
        </main>
    );
};

export default SubmittedPaperAuthor;
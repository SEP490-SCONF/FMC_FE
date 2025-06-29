import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getConferenceById, updateConference } from "../../service/ConferenceService";
import ConferenceOrganizer from "../../components/layout/organizer/ConferenceOrganizer";

const ViewpageOrganizer = () => {
    const { conferenceId } = useParams();
    const [conference, setConference] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getConferenceById(conferenceId)
            .then(res => {
                setConference(res.data || res);
            })
            .finally(() => setLoading(false));
    }, [conferenceId]);

    const handleUpdate = async (values) => {
        await updateConference(conferenceId, values);
    };

    return (
        <main className="pt-20">
            <ConferenceOrganizer
                conference={conference}
                loading={loading}
                onUpdate={handleUpdate}
            />
        </main>
    );
};

export default ViewpageOrganizer;
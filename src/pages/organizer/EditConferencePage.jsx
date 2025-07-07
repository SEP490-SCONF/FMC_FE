import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ConferenceOrganizer from "../../components/layout/organizer/ConferenceOrganizer";
import { getConferenceById, updateConference } from "../../services/ConferenceService";

const EditConferencePage = () => {
    const { id } = useParams();
    const [conference, setConference] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConference = async () => {
            try {
                const data = await getConferenceById(id);
                console.log("📦 API response from getConferenceById:", data);
                setConference(data);

            } catch (error) {
                console.error("Failed to fetch conference:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConference();
    }, [id]);

    const handleUpdate = async (updatedData) => {
        const formData = new FormData();
        formData.append("Title", updatedData.title);
        formData.append("Description", updatedData.description || "");
        formData.append("Location", updatedData.location || "");
        formData.append("StartDate", updatedData.startDate?.toISOString() || "");
formData.append("EndDate", updatedData.endDate?.toISOString() || "");

        formData.append("Status", updatedData.status ? "true" : "false");
        formData.append("CallForPaper", updatedData.callForPaper || "");

          if (updatedData.topicIds && updatedData.topicIds.length > 0) {
        updatedData.topicIds.forEach(id => formData.append("TopicIds", id));
    }


        if (updatedData.bannerImage instanceof File) {
            formData.append("BannerImage", updatedData.bannerImage);
        }

        try {
            await updateConference(id, formData); // Service gửi PUT
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    return (
        <ConferenceOrganizer
            conference={conference}
            loading={loading}
            onUpdate={handleUpdate}
        />
    );
};

export default EditConferencePage;

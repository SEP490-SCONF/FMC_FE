import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ConferenceOrganizer from "../../components/layout/organizer/ConferenceOrganizer";
import { getConferenceById, updateConference } from "../../services/ConferenceService";

const EditConferencePage = () => {
  const { conferenceId  } = useParams();
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch conference by ID
  useEffect(() => {
    const fetchConference = async () => {
      try {
        const data = await getConferenceById(conferenceId);
        console.log("📦 API response:", data);
        setConference(data);
      } catch (error) {
        console.error("❌ Failed to fetch conference:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConference();
  }, [conferenceId]);

  // Handle form submission
  const handleUpdate = async (updatedData) => {
    const formData = new FormData();

    formData.append("Title", updatedData.title);
    formData.append("Description", updatedData.description || "");
    formData.append("Location", updatedData.location || "");
    formData.append("StartDate", updatedData.startDate?.toISOString() || "");
    formData.append("EndDate", updatedData.endDate?.toISOString() || "");
    formData.append("Status", updatedData.status ? "true" : "false");

    if (updatedData.topicIds?.length > 0) {
      updatedData.topicIds.forEach((topicId) =>
        formData.append("TopicIds", topicId)
      );
    }

    if (updatedData.bannerImage instanceof File) {
      formData.append("BannerImage", updatedData.bannerImage);
    }

    try {
      await updateConference(conferenceId, formData);
      console.log("✅ Conference updated successfully");
    } catch (error) {
      console.error("❌ Update failed:", error);
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

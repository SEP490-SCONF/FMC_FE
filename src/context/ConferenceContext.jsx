import React, { createContext, useContext, useState, useEffect } from "react";
import { getConferences, getConferenceById } from "../service/ConferenceService";

const ConferenceContext = createContext();

export const ConferenceProvider = ({ children }) => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConference, setSelectedConference] = useState(null);

  // Lấy danh sách hội thảo khi app khởi động hoặc vào trang List
  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const data = await getConferences();
        setConferences(data);
      } catch {
        setConferences([]);
      } finally {
        setLoading(false);
      }
    };
    fetchConferences();
  }, []);

  // Hàm lấy chi tiết hội thảo theo id (nếu cần)
  const fetchConferenceDetail = async (conferenceId) => {
    try {
      const detail = await getConferenceById(conferenceId);
      setSelectedConference(detail);
      return detail;
    } catch {
      setSelectedConference(null);
      return null;
    }
  };

  return (
    <ConferenceContext.Provider
      value={{
        conferences,
        loading,
        selectedConference,
        setSelectedConference,
        fetchConferenceDetail,
      }}
    >
      {children}
    </ConferenceContext.Provider>
  );
};

export const useConference = () => useContext(ConferenceContext);
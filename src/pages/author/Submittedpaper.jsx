import React, { useEffect, useState } from "react";
import Submited from "../../components/layout/Submited";
import { getPapersByUserAndConference } from "../../services/PaperSerice";
import { useUser } from "../../context/UserContext";
import { useParams, useNavigate } from "react-router-dom";

const SubmittedPaperAuthor = () => {
  const { user } = useUser();
  const { conferenceId } = useParams();
  const [papers, setPapers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (user && conferenceId) {
      getPapersByUserAndConference(user.userId, conferenceId)
        .then((res) => {
          console.log("Paper response:", res); // In ra res để kiểm tra dữ liệu nhận được
          const papersData = res.data || res;
          if (!papersData || papersData.length === 0) {
            navigate("/not-found");
            return;
          }
          setPapers(papersData);
        })
        .catch(() => {
          navigate("/not-found");
        });
    }
  }, [user, conferenceId, navigate]);

  return (
    <main>
      <Submited
        submissions={papers}
        userId={user?.userId}
        conferenceId={conferenceId}
      />
    </main>
  );
};

export default SubmittedPaperAuthor;

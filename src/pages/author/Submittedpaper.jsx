import React, { useEffect, useState } from "react";
import Submited from "../../components/paper/PaperSubmissionsTable";
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
      <Submited submissions={papers} />
    </main>
  );
};

export default SubmittedPaperAuthor;

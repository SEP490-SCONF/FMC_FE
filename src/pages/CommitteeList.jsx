import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import Committee from "../components/layout/Committee";
import { getCommitteeByConference } from "../services/UserConferenceRoleService";

const Comm = () => {
    const { id } = useParams();
    const [committee, setCommittee] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
    getCommitteeByConference(id)
        .then((res) => {
            const data = res.data || res;
            if (!data || data.length === 0) {
                navigate("/not-found");
                return;
            }
            setCommittee(data);
        })
        .catch(() => {
            navigate("/not-found");
        })
        .finally(() => setLoading(false));
}, [id, navigate]);

    return (
        <main className="pt-20">
            <Committee committee={committee} loading={loading} />
        </main>
    );
};

export default Comm;
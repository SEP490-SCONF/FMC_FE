import React, { useEffect, useState } from "react";
import OrganizerListView from "../../components/layout/organizer/Organizerlistview";
import { getConferencesByUserAndRole } from "../../Service/UserConferenceRoleService";
import { useUser } from "../../context/UserContext";

const OrganizerView = () => {
    const [conferences, setConferences] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        if (user && user.userId) {
            getConferencesByUserAndRole(user.userId, "Organizer")
                .then((res) => {
                    setConferences(res.data || res);
                })
                .catch((err) => console.error(err));
        }
    }, [user]);

    return (
        <>
            <main className="pt-20">
                <OrganizerListView conferences={conferences} />
            </main>
        </>
    );
};

export default OrganizerView;
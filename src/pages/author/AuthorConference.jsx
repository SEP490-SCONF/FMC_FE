import React, { useEffect, useState } from "react";
import AuthorListView from "../../components/author/AuthorListView";
import { getConferencesByUserAndRole } from "../../services/UserConferenceRoleService";
import { useUser } from "../../context/UserContext";

const AuthorConference = () => {
    const [conferences, setConferences] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        if (user && user.userId) {
            getConferencesByUserAndRole(user.userId, "Author")
                .then((res) => {
                    setConferences(res.data || res);
                })
                .catch((err) => console.error(err));
        }
    }, [user]);

    return (
        <>
            <main className="pt-20">
                <AuthorListView conferences={conferences} />
            </main>
        </>
    );
};

export default AuthorConference;
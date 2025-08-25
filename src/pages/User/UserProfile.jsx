import React, { useEffect, useState } from "react";
import UserInfo from "../../components/UserProfile/UserProfileCard";
import { getUserProfile } from "../../services/UserService";
import { useUser } from "../../context/UserContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const UserP = () => {
  const { user: contextUser } = useUser();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!contextUser || !contextUser.userId) return;

    const fetchUser = async () => {
      try {
        const res = await getUserProfile(contextUser.userId);
        // console.log("📥 Response:", res);
        setUser(res.data || res);


      } catch (err) {
        console.error("❌ Error fetching user information:", err);
      }
    };

    fetchUser();
  }, [contextUser]);
  if (!user) return <LoadingSpinner />;

  return (
    <main className="pt-20">
      <UserInfo user={user} />
    </main>
  );
};

export default UserP;

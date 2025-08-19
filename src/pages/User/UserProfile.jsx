import React, { useEffect, useState } from "react";
import UserInfo from "../../components/UserProfile/UserProfileCard";
import { getUserProfile } from "../../services/UserService";
import { useUser } from "../../context/UserContext";

const UserP = () => {
  const { user: contextUser } = useUser();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!contextUser || !contextUser.userId) return;

    const fetchUser = async () => {
      try {
        const res = await getUserProfile(contextUser.userId);
console.log("📥 Response:", res);
setUser(res.data || res);


      } catch (err) {
        console.error("❌ Error fetching user information:", err);
      }
    };

    fetchUser();
  }, [contextUser]);
  if (!user) return <div>Đang tải...</div>;

  return (
    <main className="pt-20">
      <UserInfo user={user} />
    </main>
  );
};

export default UserP;

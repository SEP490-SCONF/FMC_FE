import React, { useEffect, useState } from "react";
import UserInfo from "../components/layout/UserInfo";
import { apiService } from '../api/ApiService';

const UserP = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await apiService.get("/UserProfile/2");
                setUser(res);
            } catch (err) {
                console.error("❌ Lỗi khi lấy thông tin người dùng:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <div className="text-center p-5">⏳ Đang tải dữ liệu người dùng...</div>;
    if (!user) return <div className="text-center p-5 text-danger">Không tìm thấy thông tin người dùng.</div>;

    return (
        <main className="pt-20">
            <UserInfo user={user} />
        </main>
    );
};

export default UserP;
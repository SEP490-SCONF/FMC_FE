import React, { useState } from "react";
import { FaUser, FaEnvelope, FaEdit, FaUserShield } from "react-icons/fa";
import { getUserProfile, updateUserProfile } from "../../services/UserService";
import "../../assets/styles/pages/_section.scss";

export default function UserInfo({ user }) {
  const [userData, setUserData] = useState(user);
  const [formData, setFormData] = useState({
    name: user.name || "",
    avatarUrl: user.avatarUrl || "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const openEdit = () => setIsEditing(true);
  const closeEdit = () => {
    setFormData({ name: userData.name, avatarUrl: userData.avatarUrl });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const userId = userData?.id || userData?.userId;
      if (!userId) {
        console.error("❌ Không tìm thấy userId để cập nhật.", userData);
        return;
      }

      const safeFormData = {
        name: formData.name?.trim() || "",
        avatarUrl: formData.avatarUrl?.startsWith("data:image")
          ? formData.avatarUrl
          : null,
      };

      await updateUserProfile(userId, safeFormData);

      const updated = await getUserProfile(userId);
      setUserData(updated.data || updated);
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật hồ sơ:", error);
    }
  };

  if (!userData) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="w-full px-4 md:px-12 py-10 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-10">
        👤 User Profile
      </h1>

      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Avatar & Info */}
          <div className="flex flex-col items-center justify-center p-8 bg-blue-50 dark:bg-gray-800">
            <div className="w-44 h-44 rounded-full overflow-hidden shadow-xl border-4 border-blue-400">
              <img
                src={userData.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">
              {userData.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
              <FaEnvelope className="inline mr-2 text-blue-400" />
              {userData.email}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
              <FaUserShield className="inline mr-2 text-yellow-500" />
              {userData.roleName}
            </p>

           <button
  onClick={openEdit}
  className="mt-6 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-md transition duration-300 ease-in-out text-sm md:text-base flex items-center gap-2"
>
  <FaEdit className="text-white text-base" />
  Edit Profile
</button>

          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="lg:col-span-2 p-10">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                ✏️ Edit Your Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Avatar (upload)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({
                            ...formData,
                            avatarUrl: reader.result,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={closeEdit}
                  className="px-5 py-2 rounded text-sm font-medium border border-gray-400 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 rounded text-sm font-semibold bg-yellow-400 hover:bg-yellow-500 text-black transition shadow-md"
                >
                  💾 Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

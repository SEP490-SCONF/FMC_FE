import React, { useState, useEffect } from "react";
import { FaEnvelope, FaEdit, FaUserShield, FaUser, FaEye, FaClipboardCheck} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Pagination, Input, Select } from "antd";
import {
  getUserConferenceRolesByUserId
} from "../../services/UserConferenceRoleService";
import { getAcceptedPapersByUserAndConference } from "../../services/PaperSerice";
import {
  countCompletedReviewsByUserAndConference,
  getCompletedReviewsByUserAndConference
} from "../../services/ReviewService";
import { updateUserProfile } from "../../services/UserService";
import LoadingSpinner from "../../components/common/LoadingSpinner";


const { Option } = Select;

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-11/12 md:w-1/2 p-6 max-h-[80vh] overflow-y-auto border border-gray-200 relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold"
          onClick={onClose}
        >
          ✖
        </button>
        <div className="space-y-2">{children}</div>
      </div>
    </div>
  );
}

export default function UserInfo({ user }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(user);
  const [formData, setFormData] = useState({
    name: user.name || "",
    avatarUrl: user.avatarUrl || "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const [userConferences, setUserConferences] = useState([]);
  const [filteredConferences, setFilteredConferences] = useState([]);
  const [openConferences, setOpenConferences] = useState({});
  const [papersWithConference, setPapersWithConference] = useState({});
  const [completedReviewCount, setCompletedReviewCount] = useState({});

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Phân trang cho danh sách conferences
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Phân trang cho modal reviews
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const modalPageSize = 3;

  // Tìm kiếm và filter
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("All"); // filter theo role

  const openEdit = () => setIsEditing(true);
  const closeEdit = () => {
    setFormData({ name: userData.name, avatarUrl: userData.avatarUrl });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const userId = userData?.id || userData?.userId;
      if (!userId) return;

      const formDataToSend = new FormData();
      formDataToSend.append("Name", formData.name);
      if (formData.avatarFile) {
        formDataToSend.append("AvatarFile", formData.avatarFile);
      }

      await updateUserProfile(userId, formDataToSend);
      window.location.reload();
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật hồ sơ:", error);
    }
  };

  // Load conferences
  useEffect(() => {
    const fetchConferences = async () => {
      const userId = userData?.id || userData?.userId;
      if (!userId) return;
      try {
        const res = await getUserConferenceRolesByUserId(userId);
        const roles = res?.data || res || [];
        setUserConferences(roles);
        setFilteredConferences(roles);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách conference:", error);
      }
    };
    fetchConferences();
  }, [userData]);

  // Load papers per conference for Author
  useEffect(() => {
    const fetchPapersPerConference = async () => {
      const userId = userData?.id || userData?.userId;
      if (!userId || userConferences.length === 0) return;

      const papersByConference = {};
      await Promise.all(
        userConferences.map(async (ucr) => {
          if (ucr.roleName === "Author") {
            try {
              const res = await getAcceptedPapersByUserAndConference(userId, ucr.conferenceId);
              papersByConference[ucr.conferenceId] = res || [];
            } catch (error) {
              console.error(`❌ Lỗi tải papers conference ${ucr.conferenceId}:`, error);
              papersByConference[ucr.conferenceId] = [];
            }
          }
        })
      );
      setPapersWithConference(papersByConference);
    };
    fetchPapersPerConference();
  }, [userConferences, userData]);

  // Load completed review counts for Reviewer
  useEffect(() => {
    const fetchCompletedReviewCounts = async () => {
      const userId = userData?.id || userData?.userId;
      if (!userId || userConferences.length === 0) return;

      const counts = {};
      await Promise.all(
        userConferences.map(async (ucr) => {
          if (ucr.roleName === "Reviewer") {
            try {
              const res = await countCompletedReviewsByUserAndConference(userId, ucr.conferenceId);
              counts[ucr.conferenceId] = res?.completedReviewCount ?? 0;
            } catch (error) {
              console.error(`❌ Lỗi count completed reviews conf ${ucr.conferenceId}:`, error);
              counts[ucr.conferenceId] = 0;
            }
          }
        })
      );
      setCompletedReviewCount(counts);
    };
    fetchCompletedReviewCounts();
  }, [userConferences, userData]);

  // Xử lý click Reviewer
  const handleReviewerClick = async (conferenceId) => {
    setLoadingReviews(true);
    setModalCurrentPage(1); // reset page
    try {
      const userId = userData.id || userData.userId;
      const res = await getCompletedReviewsByUserAndConference(userId, conferenceId);
      setSelectedReviews(res || []);
      setReviewModalOpen(true);
    } catch (error) {
      console.error("❌ Lỗi khi lấy completed reviews:", error);
      setSelectedReviews([]);
      setReviewModalOpen(true);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Tìm kiếm và filter conferences
  const handleSearch = (value) => {
    setSearchText(value);
    filterConferences(value, roleFilter);
    setCurrentPage(1);
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    filterConferences(searchText, role);
    setCurrentPage(1);
  };

  const filterConferences = (search, role) => {
    let filtered = [...userConferences];
    if (search) {
      filtered = filtered.filter((c) =>
        c.conferenceTitle.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (role && role !== "All") {
      filtered = filtered.filter((c) => c.roleName === role);
    }
    setFilteredConferences(filtered);
  };

  // Lấy conferences của trang hiện tại
  const paginatedConferences = filteredConferences.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Phân trang modal reviews
  const paginatedReviews = selectedReviews.slice(
    (modalCurrentPage - 1) * modalPageSize,
    modalCurrentPage * modalPageSize
  );

  if (!userData) return <LoadingSpinner />;

  return (
    <div className="w-full px-4 md:px-12 py-10 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">👤 User Profile</h1>

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Avatar & Info */}
          <div className="flex flex-col items-center justify-center p-8 bg-blue-50">
            <div className="w-44 h-44 rounded-full overflow-hidden shadow-xl border-4 border-blue-400">
              <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <p className="text-2xl font-semibold text-gray-700 mt-4 flex items-center">
              <FaUser className="mr-2 text-gray-400" /> 
              {userData.name}
            </p>
            <p className="text-lg text-gray-500 mt-1">
              <FaEnvelope className="inline mr-2 text-blue-400" />
              {userData.email}
            </p>
            <p className="text-lg text-gray-500 mt-1">
              <FaUserShield className="inline mr-2 text-yellow-500" />
              {userData.roleName}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-md transition duration-300 ease-in-out text-sm md:text-base flex items-center gap-2"
            >
              <FaEdit className="text-white text-base" /> Edit Profile
            </button>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="lg:col-span-2 p-10">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">✏️ Edit Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Avatar (upload)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () =>
                          setFormData({ ...formData, avatarUrl: reader.result, avatarFile: file });
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button onClick={closeEdit} className="px-5 py-2 rounded text-sm font-medium border border-gray-400 text-gray-700 hover:bg-gray-100">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-5 py-2 rounded text-sm font-semibold bg-yellow-400 hover:bg-yellow-500 text-black transition shadow-md">
                  💾 Save Changes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Conferences */}
        <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🏛️ Your Conferences</h3>

          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <Input.Search
              placeholder="Search conferences..."
              allowClear
              enterButton
              size="middle"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1"
            />
            <Select
              value={roleFilter}
              onChange={handleRoleFilter}
              className="w-40"
            >
              <Option value="All">All Roles</Option>
              <Option value="Author">Author</Option>
              <Option value="Reviewer">Reviewer</Option>
              <Option value="Organizer">Organizer</Option>
            </Select>
          </div>

          {filteredConferences.length === 0 ? (
            <p className="text-gray-500">No conferences found.</p>
          ) : (
            <div className="space-y-3">
              {paginatedConferences.map((ucr) => {
                const isOpen = openConferences[ucr.conferenceId] || false;
                const papersInConference = papersWithConference[ucr.conferenceId] || [];

                return (
                  <div key={ucr.id} className="bg-white border border-gray-200 rounded-lg">
                    <div
                      className="flex justify-between items-center p-3 cursor-pointer"
                      onClick={() => {
                        if (ucr.roleName === "Reviewer") {
                          handleReviewerClick(ucr.conferenceId);
                        } else {
                          setOpenConferences((prev) => ({ ...prev, [ucr.conferenceId]: !isOpen }));
                        }
                      }}
                    >
                      <span className="font-medium text-gray-800 flex items-center gap-2">
                        {ucr.conferenceTitle} ({ucr.roleName})
                        <FaEye
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/conference/${ucr.conferenceId}`);
                          }}
                        />
                        {ucr.roleName === "Reviewer" && (
                          <span
                            className="ml-2 text-sm text-green-600 cursor-pointer 
                                       hover:text-green-800 hover:underline 
                                       hover:scale-105 transition-transform duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReviewerClick(ucr.conferenceId);
                            }}
                          >
                            • {completedReviewCount[ucr.conferenceId] || 0} papers reviewed
                          </span>
                        )}
                      </span>
                      <span className="text-gray-500">{isOpen ? "▲" : "▼"}</span>
                    </div>

                    {isOpen && ucr.roleName === "Author" && (
                      <ul className="ml-4 mb-3 space-y-2">
                        {papersInConference.length === 0 ? (
                          <li className="text-gray-500">No papers submitted in this conference.</li>
                        ) : (
                          papersInConference.map((paper) => (
                            <li
                              key={paper.paperId}
                              className="p-2 bg-gray-100 border border-gray-200 rounded flex justify-between items-center"
                            >
                              <a
                                href={paper.filePath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-800 font-medium cursor-pointer 
                                           hover:text-blue-700 hover:underline 
                                           hover:bg-blue-100 hover:shadow transition-all duration-200 px-1 rounded"
                              >
                                {paper.title}
                              </a>
                              {paper.status === "Accepted" && (
                                <button
                                  className="ml-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-green-500 text-green-700 bg-green-50 hover:bg-green-100 transition shadow-sm"
                                  onClick={() => navigate(`/author/view-certificates/${paper.paperId}`)}
                                >
                                  🎓 View Certificate
                                </button>
                              )}
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                  </div>
                );
              })}

              {/* Pagination */}
              <div className="flex justify-center mt-4">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredConferences.length}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                  simple
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviewer Modal */}
     {/* Reviewer Modal */}
{reviewModalOpen && (
  <Modal 
    title={
      <div className="flex items-center gap-2 text-lg font-bold text-blue-700">
        <FaClipboardCheck className="text-green-600" /> Completed Reviews
      </div>
    } 
    onClose={() => setReviewModalOpen(false)}
  >
    {loadingReviews ? (
      <p className="text-gray-600 text-base">Loading...</p>
    ) : selectedReviews.length === 0 ? (
      <p className="text-gray-600 text-base">No completed reviews yet.</p>
    ) : (
      <>
        <table className="w-full border border-gray-200 rounded mb-4 text-sm md:text-base">
          <thead className="bg-gray-100 sticky top-0 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">Paper</th>
              <th className="px-3 py-2 text-left">Author</th>
              <th className="px-3 py-2 text-left">Reviewed At</th>
            </tr>
          </thead>
                  <tbody>
  {paginatedReviews.map((rev) => {
    const reviewedDate = new Date(rev.reviewedAt);
    const formattedDate = `${String(reviewedDate.getDate()).padStart(2,'0')}/${String(reviewedDate.getMonth()+1).padStart(2,'0')}/${reviewedDate.getFullYear()} ${String(reviewedDate.getHours()).padStart(2,'0')}:${String(reviewedDate.getMinutes()).padStart(2,'0')}`;

    return (
      <tr key={rev.reviewId} className="border-t border-gray-200 hover:bg-gray-50 transition text-sm">
        {/* Paper có thể wrap */}
        <td className="px-2 py-1 text-gray-800 max-w-[250px] break-words">
          {rev.paperTitle}
        </td>
        {/* Author và Reviewed At luôn 1 dòng */}
        <td className="px-2 py-1 text-gray-800 whitespace-nowrap">{rev.authorName}</td>
        <td className="px-2 py-1 text-gray-800 whitespace-nowrap">{formattedDate}</td>
      </tr>
    );
  })}
</tbody>



        </table>

        {/* Pagination modal */}
        <div className="flex justify-center">
          <Pagination
            current={modalCurrentPage}
            pageSize={modalPageSize}
            total={selectedReviews.length}
            onChange={(page) => setModalCurrentPage(page)}
            showSizeChanger={false}
            simple
          />
        </div>
      </>
    )}
  </Modal>
)}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCallForPapersByConferenceId } from "../../services/CallForPaperService";
import { getTimelinesByConferenceId } from "../../services/TimelineService";
import { getSchedulesByTimeline } from "../../services/ScheduleService"; // <-- import này

import dayjs from "dayjs";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import {
  CalendarDays,
  MapPin,
  FileText,
  BookOpen,
  FileDown,
  CheckCircle,
  XCircle,
  Landmark,
  Globe,
  FilePenLine,
} from "lucide-react";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Eye } from "lucide-react";
import { Modal, List } from "antd"; // dùng Ant Design Modal và List

const CFP = () => {
  const { id } = useParams(); // conferenceId
  const [cfp, setCfp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timelineList, setTimelineList] = useState([]);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [selectedTimelineSchedules, setSelectedTimelineSchedules] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [presentedPapers, setPresentedPapers] = useState([]);


  const handleViewSchedule = async (timelineId) => {
    try {
      const res = await getSchedulesByTimeline(timelineId);
      // console.log("API response for timelineId", timelineId, res);

      // res đã là mảng, không cần res.data
      const schedules = res || [];
      // console.log("Parsed schedules:", schedules);

      setSelectedTimelineSchedules(schedules);
      setScheduleModalVisible(true);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setSelectedTimelineSchedules([]);
      setScheduleModalVisible(true);
    }
  };



  useEffect(() => {
    const fetchPresentedPapers = async () => {
      try {
        const res = await getPresentedPapersByConferenceId(id);
        setPresentedPapers(res || []);
      } catch (err) {
        console.error("Error fetching presented papers:", err);
        setPresentedPapers([]);
      }
    };
    fetchPresentedPapers();
  }, [id]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi CallForPaper
        const data = await getCallForPapersByConferenceId(id);
        if (data.length > 0) {
          const activeCfp = data.find((item) => item.status === true);
          setCfp(activeCfp || null); // nếu không có cái nào active thì null
        }

        // Gọi Timeline
        getTimelinesByConferenceId(id)
          .then((res) => setTimelineList(res))
          .catch((err) => {
            console.error("Error fetching timeline:", err);
            setTimelineList([]);
          });

      } catch (error) {
        console.error("Error fetching CFP:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Loading
  if (loading)
    return (
      <LoadingSpinner />
    );

  // Không có CFP
  if (!cfp) {
    return (
      <div className="text-center text-red-600 py-10 text-lg">
        ❌ No Call For Paper found for this conference.
      </div>
    );
  }


  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4 md:px-0">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-10 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 tracking-wide">CALL FOR</h1>
          <h2 className="text-4xl md:text-5xl font-extrabold text-orange-600 tracking-wide mb-2">PAPERS</h2>
          <p className="text-black-800 font-medium text-base md:text-lg max-w-3xl mx-auto text-justify leading-relaxed break-words">
            {cfp.description}
          </p>


        </div>

        {/* Banner and Topics */}
        <div className="grid md:grid-cols-10 gap-6 items-start">
          {/* Banner - 7/10 */}
          {cfp?.conference?.bannerUrl && (
            <div className="col-span-10 md:col-span-7">
              <img
                src={cfp.conference.bannerUrl}
                alt="Conference Banner"
                className="w-full h-56 object-cover rounded-xl shadow"
              />
            </div>
          )}

          {/* Topics - 3/10 */}
          <div className="col-span-10 md:col-span-3">
            <h3 className="text-lg font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2 mb-3">
              <BookOpen className="text-green-600" size={20} />
              Topics
            </h3>
            <ul className="space-y-2">
              {cfp.conference?.topics?.map((topic) => (
                <li
                  key={topic.topicId}
                  className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-900 px-3 py-2 rounded-lg shadow-sm w-fit"
                >
                  <span className="mt-0.5 text-green-600">✓</span>
                  <span className="font-medium">{topic.topicName}</span>
                </li>
              ))}
            </ul>

          </div>

        </div>

        {/* Conference Info & Template */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Conference Info */}
          <div className="space-y-3 text-gray-800">
            <h3 className="text-xl font-bold text-blue-700 flex items-center gap-2">
              <CalendarDays className="text-blue-600" size={20} />
              Conference Info
            </h3>
            <p className="flex items-center gap-2">
              <Landmark size={16} className="text-gray-600" />{" "}
              <strong>Title:</strong> {cfp.conference?.title}
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-600" />{" "}
              {cfp.conference?.location}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(cfp.conference?.startDate).toLocaleDateString()} –{" "}
              {new Date(cfp.conference?.endDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Submission Deadline:</strong>{" "}
              <span className="text-red-600 font-semibold">
                {new Date(cfp.deadline).toLocaleDateString()}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <strong>Status:</strong>{" "}
              {cfp.status ? (
                <span className="text-green-600 font-semibold flex items-center">
                  <CheckCircle size={16} /> Open
                </span>
              ) : (
                <span className="text-red-600 font-semibold flex items-center">
                  <XCircle size={16} /> Closed
                </span>
              )}
            </p>
          </div>

          {/* Right: Template */}
          <div className="text-gray-800">
            <h3 className="text-lg font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2 mb-2">
              <FileText className="text-purple-600" size={20} />
              Template
            </h3>
            {cfp.templatePath ? (
              <a
                href={cfp.templatePath}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:text-blue-900 font-medium px-4 py-2 rounded-lg shadow-sm transition"
              >
                <FileDown size={18} />
                Download Template
              </a>
            ) : (
              <p className="text-gray-500 italic mt-2">No template available.</p>
            )}
          </div>

        </div>

        {/* Timeline Section - Dynamic from API */}
        <div className="pt-8">
          <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">
            Timeline
          </h3>

          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-center text-gray-700 relative">
            {timelineList.length === 0 ? (
              <div className="text-gray-500 text-center">No timeline available</div>
            ) : (
              timelineList
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((item, index) => {
                  const bgColors = [
                    "bg-blue-100",
                    "bg-green-100",
                    "bg-yellow-100",
                    "bg-purple-100",
                    "bg-pink-100",
                    "bg-orange-100",
                    "bg-red-100",
                    "bg-teal-100",
                  ];
                  const textColors = [
                    "text-blue-800",
                    "text-green-800",
                    "text-yellow-800",
                    "text-purple-800",
                    "text-pink-800",
                    "text-orange-800",
                    "text-red-800",
                    "text-teal-800",
                  ];
                  const bgColor = bgColors[index % bgColors.length];
                  const textColor = textColors[index % textColors.length];

                  return (
                    <div key={item.timeLineId} className="relative flex items-center">
                      {index > 0 && (
                        <div className="w-6 h-1 bg-gray-300 mx-2 rounded"></div>
                      )}
                      <div className={`${bgColor} rounded-xl p-4 shadow w-40 relative`}>
                        <p className={`font-bold ${textColor}`}>
                          {dayjs(item.date).format("MMM D, HH:mm")}
                        </p>
                        <p>{item.description}</p>

                        {/* Icon View Schedule */}
                        <button
                          onClick={() => handleViewSchedule(item.timeLineId)}
                          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                          title="View Schedule"
                        >
                          <Eye size={18} />
                        </button>

                      </div>

                    </div>
                  );
                })
            )}
          </div>
        </div>

        <Modal
          title="View Schedule"
          open={scheduleModalVisible}
          onCancel={() => setScheduleModalVisible(false)}
          footer={null}
          width={600}
        >
          {selectedTimelineSchedules.length === 0 ? (
            <p className="text-gray-500 text-center">No schedules available</p>
          ) : (
            <List
              dataSource={selectedTimelineSchedules}
              renderItem={(item) => {
                const paper =
                  item.paper || presentedPapers.find(p => p.paperId === item.paperId) || null;
                const presenter =
                  item.presenter?.name
                    ? item.presenter
                    : paper?.paperAuthors?.[0]?.author
                      ? paper.paperAuthors[0].author
                      : item.presenterName
                        ? { name: item.presenterName }
                        : null;

                return (
                  <List.Item>
                    <div className="space-y-1">
                      <p className="font-semibold">
                        {dayjs(item.presentationStartTime).format("HH:mm")} -{" "}
                        {dayjs(item.presentationEndTime).format("HH:mm")} :{" "}
                        {item.sessionTitle}
                      </p>
                      {paper?.title && <p>📝 Paper: {paper.title}</p>}
                      {presenter?.name && <p>👤 Presenter: {presenter.name}</p>}
                      {item.location && <p>📍 Location: {item.location}</p>}
                    </div>
                  </List.Item>
                );
              }}
            />
          )}
        </Modal>


        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link
              to={`/conference/${id}/paper-submition`}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 ring-2 ring-emerald-300/50 hover:ring-emerald-400"
            >
              ✍️ Submit Now
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>


      </div>
    </section>
  );
};

export default CFP;

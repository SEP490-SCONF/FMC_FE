import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import PayService from "../../services/PayService";
import { getFeesByConferenceId } from "../../services/ConferenceFeesService";

const RegisterPage = () => {
  const { id: conferenceId } = useParams();
  const { user } = useUser();
  const userId = user?.userId;
  const navigate = useNavigate();

  const [hasPaid, setHasPaid] = useState(false);
  const [feeDetail, setFeeDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkParticipation = async () => {
      if (!userId || !conferenceId) return;

      try {
        // Lấy tất cả Participation Fees (feeTypeId = 2)
        const fees = await getFeesByConferenceId(conferenceId);
        const participationFees = fees.filter(f => f.feeTypeId === 2);

        if (!participationFees.length) {
          setHasPaid(false);
          return;
        }

        // Check payment cho tất cả mode
        const paymentChecks = await Promise.all(
          participationFees.map(f =>
            PayService.hasUserPaidFee(conferenceId, f.feeDetailId)
          )
        );

        // Tìm fee nào đã thanh toán
        const paidIndex = paymentChecks.findIndex(res => res?.hasPaid ?? res?.HasPaid);
        if (paidIndex !== -1) {
          setHasPaid(true);
          setFeeDetail(participationFees[paidIndex]); // Hiển thị FeeDetail đã thanh toán
        } else {
          setHasPaid(false);
        }

      } catch (err) {
        console.error("Error checking participation payment:", err);
        setHasPaid(false);
      } finally {
        setLoading(false);
      }
    };

    checkParticipation();
  }, [userId, conferenceId]);

  if (loading)
    return (
      <p className="text-gray-600 mt-8 text-center">
        Đang kiểm tra trạng thái đăng ký...
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">
        Register for Conference 
      </h1>

      {hasPaid ? (
        <>
          <p className="text-green-600 font-semibold">
            ✅ You have registered for this conference
          </p>

          {feeDetail && (
            <div className="mt-6 p-4 border rounded bg-gray-50">
              <h2 className="text-lg font-semibold mb-2">Your Fee Info</h2>
              <p>
                <span className="font-medium">Purpose:</span>{" "}
                {feeDetail.feeTypeName || feeDetail.feeType}
              </p>
              <p>
                <span className="font-medium">Mode:</span> {feeDetail.mode}
              </p>
              <p>
                <span className="font-medium">Amount:</span>{" "}
                {Number(feeDetail.amount).toLocaleString("vi-VN")} VND
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <p className="text-red-600 font-semibold">
            ⚠ You are not registered for this conference. Payment is required to
            complete registration.
          </p>
          <button
            className="bg-blue-700 text-white font-semibold px-6 py-2 rounded hover:bg-blue-800 transition"
            onClick={() =>
              navigate(`/conference/${conferenceId}/register/payment`, {
                state: { conferenceId },
              })
            }
          >
            Register Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;

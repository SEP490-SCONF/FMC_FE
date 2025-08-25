import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import OrganizerTrackincome from "../../components/payment/OrganizerTrackincome";
import PayService from "../../services/PayService";

const OrganizerTrack = () => {
    const { conferenceId } = useParams();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                // console.log("Fetching payments for conferenceId:", conferenceId);
                const data = await PayService.getPaymentsByConference(conferenceId);
                // console.log("Fetched data:", data);
                setPayments(data);
            } catch (error) {
                console.error("Failed to fetch payments:", error);
            } finally {
                setLoading(false);
            }
        };

        if (conferenceId) {
            fetchPayments();
        } else {
            // console.log("No conferenceId available");
            setLoading(false);
        }
    }, [conferenceId]);

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <OrganizerTrackincome payments={payments} />
        </>
    );
};

export default OrganizerTrack;
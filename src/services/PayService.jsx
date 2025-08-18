import { apiService } from './ApiService';

const PayService = {
    createPayment: async (paymentData) => {
        // Trả về { checkoutUrl, orderCode }
        return await apiService.post('/Payment/create', paymentData);
    },

    paymentSuccess: async (orderCode) => {
        // Gọi API backend để xác nhận thanh toán thành công
        return await apiService.get(`/Payment/success?orderCode=${orderCode}`);
    },

    paymentCancel: async (orderCode) => {
        // Gọi API backend để hủy thanh toán
        return await apiService.get(`/Payment/cancel?orderCode=${orderCode}`);
    },

    getPaymentsByConference: async (conferenceId) => {
        // Lấy danh sách thanh toán theo conferenceId
        return await apiService.get(`/Payment/conference/${conferenceId}`);
    },

    getPaymentsByStatus: async (status) => {
        // Lấy danh sách thanh toán theo trạng thái
        return await apiService.get(`/Payment/status/${status}`);
    },

    getRecentPayments: async () => {
        // Lấy danh sách thanh toán gần đây
        return await apiService.get('/Payment/recent');
    }
};

export default PayService;

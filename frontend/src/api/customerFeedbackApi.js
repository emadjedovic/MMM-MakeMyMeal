import axios from "axios";
const API_URL = "http://localhost:8000/api";

export const submitCustomerFeedback = async (feedbackData) => {
    try {
        console.log("sending feedbackData in sumbitCustomerFeedback: ", feedbackData)
        const response = await axios.post(`${API_URL}/customer-feedback/new/`, feedbackData);
        return response.data;
    } catch (error) {
        console.error('Error in submitCustomerFeedback: ', error.response?.data?.detail || error.message);
        throw error;
    }
};

const getCustomerFeedback = async (orderId) => {
    try {
        const response = await axios.get(`${API_URL}/customer-feedback/read/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error in getCustomerFeedback:', error.response?.data?.detail || error.message);
        throw error;
    }
};
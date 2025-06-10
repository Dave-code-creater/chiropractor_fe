import axios from 'axios';
import { API_URL } from '../../constants/api';

export const sendIntakeForm = (data) =>
    axios.post(`${API_URL}/reports/intake`, data);

export const sendInsuranceDetails = (data) =>
    axios.post(`${API_URL}/reports/insurance`, data);

export const sendPainEvaluation = (data) =>
    axios.post(`${API_URL}/reports/pain-evaluation`, data);

export const sendImpact = (data) =>
    axios.post(`${API_URL}/reports/impact`, data);

export const sendHealthHistory = (data) =>
    axios.post(`${API_URL}/reports/health-history`, data);

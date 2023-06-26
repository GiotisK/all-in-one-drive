import axios from 'axios';

export const axiosInstance = axios.create({
	baseURL: 'http://localhost:8000/',
	headers: { 'Content-Type': 'application/json' },
	/* timeout: 2000, */ //TODO: take care of timeout at some point
	withCredentials: true,
});

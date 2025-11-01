import axios from 'axios';

import { config } from './common';

export const axiosInstance = axios.create({
    baseURL: config.baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
    withCredentials: true,
});

import { AxiosResponse } from 'axios';
import { axiosInstance } from '../configs/axios.configs';

export const getRequest = async <T>(path: string): Promise<AxiosResponse<T>> => {
	return axiosInstance.get(path);
};

export const postRequest = async <T, U>(path: string, data?: T): Promise<AxiosResponse<U>> => {
	return axiosInstance.post(path, data);
};

export const putRequest = async <T>(path: string, data: T) => {
	return axiosInstance.put(path, data);
};

export const deleteRequest = async (path: string) => {
	return axiosInstance.delete(path);
};

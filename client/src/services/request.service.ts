import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { axiosInstance } from '../configs/axios.configs';

export const getRequest = async <T, U>(
	path: string,
	data: AxiosRequestConfig<T> = {}
): Promise<AxiosResponse<U>> => {
	return axiosInstance.get(path, data);
};

export const postRequest = async <T>(path: string, data: T) => {
	return axiosInstance.post(path, data);
};

export const putRequest = async <T>(path: string, data: T) => {
	return axiosInstance.put(path, data);
};

export const deleteRequest = async <T>(path: string, data: AxiosRequestConfig<T>) => {
	return axiosInstance.delete(path, data);
};

import { axiosInstance } from '../configs/axios.configs';

export const getRequest = async (path: string, data: any) => {
	return axiosInstance.get(path, {
		data,
	});
};

export const postRequest = async (path: string, data: any) => {
	return axiosInstance.post(path, {
		data,
	});
};

export const putRequest = async (path: string, data: any) => {
	return axiosInstance.put(path, {
		data,
	});
};

export const deleteRequest = async (path: string, data: any) => {
	return axiosInstance.delete(path, {
		data,
	});
};

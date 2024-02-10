import { AxiosResponse } from 'axios';
import { axiosInstance } from '../configs/axios.configs';

class RequestService {
	async get<T>(path: string): Promise<AxiosResponse<T>> {
		return axiosInstance.get(path);
	}

	async post<T, U>(path: string, data?: T): Promise<AxiosResponse<U>> {
		return axiosInstance.post(path, data);
	}

	async put<T>(path: string, data?: T) {
		return axiosInstance.put(path, data);
	}

	async patch<T, U>(path: string, data?: T): Promise<AxiosResponse<U>> {
		return axiosInstance.patch(path, data);
	}

	async delete<T>(path: string): Promise<AxiosResponse<T>> {
		return axiosInstance.delete(path);
	}
}

export default new RequestService();

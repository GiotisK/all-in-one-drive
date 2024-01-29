import { RequestState } from '../types';

export interface UserState {
	isAuthenticated: boolean;
	email: string;
	requests: {
		login: RequestState;
		logout: RequestState;
		authorize: RequestState;
	};
}

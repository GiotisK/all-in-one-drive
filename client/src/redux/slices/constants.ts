import { RequestState } from './types';

export const requestInitialState: RequestState = {
	done: false,
	loading: false,
	error: false,
};

export const requestPendingState: RequestState = {
	done: false,
	loading: true,
	error: false,
};

export const requestErrorState: RequestState = {
	done: true,
	loading: false,
	error: true,
};

export const requestSuccessState: RequestState = {
	done: true,
	loading: false,
	error: false,
};

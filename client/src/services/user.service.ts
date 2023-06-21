import axios from 'axios';

const MIN_PASSWORD_LENGTH = 8;

type Status = 'success' | 'error';

export type FormResponse = {
	status: Status;
	message: string;
};

export const registerUser = async (
	email: string,
	password: string,
	confirmedPassword: string
): Promise<FormResponse> => {
	const formResponse = validateRegistrationValues(email, password, confirmedPassword);
	if (formResponse.status === 'error') {
		return formResponse;
	} else {
		//do api call.....
		return { status: 'success', message: 'Success!!!' };
	}
};

export const loginUser = async (email: string, password: string): Promise<FormResponse> => {
	//do api call....
	return { status: 'success', message: 'Success!!!' };
};

const validateRegistrationValues = (
	email: string,
	password: string,
	confirmedPassword: string
): FormResponse => {
	if (!isEmailFormat(email)) {
		return { status: 'error', message: 'Please enter a valid email address' };
	}

	if (!isAcceptablePasswordLength(password)) {
		return { status: 'error', message: 'Password must be at least 8 characters' };
	}

	if (!confirmPassword(password, confirmedPassword)) {
		return { status: 'error', message: 'Passwords do not match' };
	}

	return { status: 'success', message: 'Success!' };
};

const isEmailFormat = (email: string) => {
	const re = /\S+@\S+\.\S+/;
	return re.test(email);
};

const isAcceptablePasswordLength = (password: string) => {
	return password.length >= MIN_PASSWORD_LENGTH;
};

const confirmPassword = (password: string, confirmedPassword: string) => {
	return password === confirmedPassword;
};

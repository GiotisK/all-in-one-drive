import axios from 'axios';

export type FormResponse = {
	status: string;
	message: string;
};

export const registerUser = async (
	email: string,
	password: string,
	confirmedPassword: string
): Promise<FormResponse> => {
	if (validateRegistrationValues(email, password, confirmedPassword).status === 'error') {
		return validateRegistrationValues(email, password, confirmedPassword);
	} else {
		//do api call.....
		return { status: 'success', message: 'Success!!!' };
	}
};

export const loginUser = async (email: string, password: string): Promise<FormResponse> => {
	//do api call....
	return { status: 'success', message: 'Success!!!' };
};

export const validateRegistrationValues = (
	email: string,
	password: string,
	confirmedPassword: string
): FormResponse => {
	if (!isEmailFormat(email)) {
		return { status: 'error', message: 'Please enter a valid email address' };
	}

	if (!checkPasswordLength(password)) {
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

const checkPasswordLength = (password: string) => {
	return password.length >= 8;
};

const confirmPassword = (password: string, confirmedPassword: string) => {
	return password == confirmedPassword;
};

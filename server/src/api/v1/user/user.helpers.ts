const MIN_PASSWORD_LENGTH = 8;

export const isEmailFormat = (email: string) => {
	const re = /\S+@\S+\.\S+/;
	return re.test(email);
};

export const isAcceptablePasswordLength = (password: string) => {
	return password.length >= MIN_PASSWORD_LENGTH;
};

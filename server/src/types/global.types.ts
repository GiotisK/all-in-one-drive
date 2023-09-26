export interface RegisterUserRequestBody {
	email: string;
	password: string;
}

export interface LoginUserRequestBody {
	email: string;
	password: string;
}

export enum Status {
	OK = 200,
	INTERNAL_SERVER_ERROR = 500,
	UNAUTHORIZED = 401,
}

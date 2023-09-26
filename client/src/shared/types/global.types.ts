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
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	INTERNAL_SERVER_ERROR = 500,
}

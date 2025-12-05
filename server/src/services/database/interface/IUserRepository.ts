import { Nullable } from '../../../types/global.types';
import { UserDTO } from '../types';

export interface IUserRepository {
	saveUser(email: string, password: string): Promise<boolean>;
	getUser(email: string): Promise<Nullable<UserDTO>>;
}

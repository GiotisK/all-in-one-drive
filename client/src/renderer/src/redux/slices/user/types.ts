import { Nullable } from '../../../shared/types/global.types';

export interface UserState {
    isAuthenticated: Nullable<boolean>;
    email: string;
}

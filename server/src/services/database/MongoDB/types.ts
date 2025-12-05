import { DriveDTO, UserDTO } from '../types';

export type MongoDBUserSchema = UserDTO & { drives: DriveDTO[] };

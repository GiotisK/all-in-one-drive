import Database from 'better-sqlite3';
import { Nullable } from '../../../../types/global.types';
import { UserDTO } from '../../types';
import { SQLiteUserSchema } from '../types';
import { IUserRepository } from '../../interface/IUserRepository';

export class SQLiteUserRepository implements IUserRepository {
	private db: Database.Database;

	constructor(db: Database.Database) {
		this.db = db;
	}

	public async saveUser(email: string, password: string): Promise<boolean> {
		try {
			const insertUserQuery = this.db.prepare<[string, string]>(
				'INSERT INTO users (email, password) VALUES (?, ?)'
			);
			insertUserQuery.run(email, password);

			return true;
		} catch {
			return false;
		}
	}

	public async getUser(email: string): Promise<Nullable<UserDTO>> {
		try {
			const getUserQuery = this.db.prepare<string, SQLiteUserSchema>(
				'SELECT * FROM users WHERE email = ?'
			);
			const user = getUserQuery.get(email);

			return user ?? null;
		} catch {
			return null;
		}
	}
}

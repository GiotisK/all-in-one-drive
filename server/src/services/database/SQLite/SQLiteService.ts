import Database from 'better-sqlite3';
import { DriveType, Nullable } from '../../../types/global.types';
import { IDatabaseService } from '../IDatabaseService';
import { DriveDTO, UserDTO } from '../types';

type SQLiteDriveSchema = DriveDTO & { user_id: number };
type SQLiteUserSchema = Omit<UserDTO, 'drives'>;

export class SqliteDBService implements IDatabaseService {
	private db: Database.Database;

	constructor() {
		this.db = new Database('./src/services/database/SQLite/database.db', {
			verbose: console.log,
		});
	}

	connect(): void {
		this.db
			.prepare(
				`CREATE TABLE IF NOT EXISTS users (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					email TEXT NOT NULL UNIQUE,
					password TEXT)`
			)
			.run();

		this.db
			.prepare(
				`CREATE TABLE IF NOT EXISTS drives (
					id TEXT PRIMARY KEY,
 					user_id INTEGER NOT NULL,
					email TEXT NOT NULL,
					virtualFolderId TEXT DEFAULT '',
					token TEXT NOT NULL,
					driveType TEXT NOT NULL,
					FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`
			)
			.run();
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

	public async saveDrive(
		encryptedTokenData: string,
		driveEmail: string,
		userEmail: string,
		drive: DriveType,
		driveId: string
	): Promise<boolean> {
		try {
			const getUserQuery = this.db.prepare<string, SQLiteUserSchema>(
				'SELECT * FROM users WHERE email = ?'
			);
			const user = getUserQuery.get(userEmail);

			if (!user) return false;

			const insertDriveQuery = this.db.prepare<[string, number, string, string, DriveType]>(
				'INSERT INTO drives (id, user_id, email, token, driveType) VALUES (?, ?, ?, ?, ?)'
			);
			insertDriveQuery.run(driveId, user.id, driveEmail, encryptedTokenData, drive);

			return true;
		} catch {
			return false;
		}
	}

	public async getAllDrives(userEmail: string): Promise<Nullable<DriveDTO[]>> {
		try {
			const getDrivesOfUserQuery = this.db.prepare<string, SQLiteDriveSchema>(
				'SELECT * FROM users JOIN drives ON users.id = drives.user_id WHERE users.email = ?'
			);

			const drives = getDrivesOfUserQuery.all(userEmail);

			return drives;
		} catch (e) {
			return null;
		}
	}

	public async getDrive(_userEmail: string, driveId: string): Promise<Nullable<DriveDTO>> {
		try {
			const getDriveQuery = this.db.prepare<[string], SQLiteDriveSchema>(
				'SELECT * FROM drives WHERE id = ?'
			);
			const drive = getDriveQuery.get(driveId);

			return drive || null;
		} catch {
			return null;
		}
	}

	public async deleteDrive(_userEmail: string, driveId: string): Promise<boolean> {
		try {
			const deleteDriveQuery = this.db.prepare<[string]>('DELETE FROM drives WHERE id = ?');
			const result = deleteDriveQuery.run(driveId);

			return result.changes > 0;
		} catch {
			return false;
		}
	}

	public async updateToken(driveId: string, encryptedTokenData: string): Promise<boolean> {
		try {
			const updateTokenQuery = this.db.prepare<[string, string]>(
				'UPDATE drives SET token = ? WHERE id = ?'
			);
			const result = updateTokenQuery.run(encryptedTokenData, driveId);

			return result.changes > 0;
		} catch {
			return false;
		}
	}
}

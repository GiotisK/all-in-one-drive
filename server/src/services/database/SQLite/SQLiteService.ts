import Database from 'better-sqlite3';

export class SqliteDBService {
	private static instance: SqliteDBService;
	private db = new Database('./src/services/database/SQLite/database.db', {
		verbose: console.log,
	});

	static getInstance() {
		if (!SqliteDBService.instance) {
			SqliteDBService.instance = new SqliteDBService();
		}
		return SqliteDBService.instance;
	}

	private constructor() {
		this.connect();
	}

	get connection() {
		return this.db;
	}

	private connect(): void {
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
 					userId INTEGER NOT NULL,
					email TEXT NOT NULL,
					virtualFolderId TEXT DEFAULT '',
					token TEXT NOT NULL,
					driveType TEXT NOT NULL,
					FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE)`
			)
			.run();

		this.db
			.prepare(
				`CREATE TABLE IF NOT EXISTS virtualfolders (
					id TEXT PRIMARY KEY,
					name TEXT NOT NULL,
 					userId INTEGER NOT NULL,
					parentFolderId TEXT DEFAULT '',
					FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE)`
			)
			.run();
	}
}

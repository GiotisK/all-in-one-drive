import { DatabaseTypeConfig } from './config';
import { IDriveRepository } from './interface/IDriveRepository';
import { IUserRepository } from './interface/IUserRepository';
import { MongoDBService } from './MongoDB/MongoDBService';
import { MongoDBDriveRepository } from './MongoDB/repositories/MongoDBDriveRepository';
import { MongoDBUserRepository } from './MongoDB/repositories/MongoDBUserRepository';
import { SQLiteDriveRepository } from './SQLite/repositories/SQLiteDriveRepository';
import { SQLiteUserRepository } from './SQLite/repositories/SQLiteUserRepository';
import { SqliteDBService } from './SQLite/SQLiteService';

let DriveRepository: IDriveRepository;
let UserRepository: IUserRepository;

if (DatabaseTypeConfig === 'sqlite') {
	const sqliteDbService = SqliteDBService.getInstance();

	DriveRepository = new SQLiteDriveRepository(sqliteDbService.connection);
	UserRepository = new SQLiteUserRepository(sqliteDbService.connection);
} else if (DatabaseTypeConfig === 'mongodb') {
	const mongoDbService = new MongoDBService();
	mongoDbService.connect();

	DriveRepository = new MongoDBDriveRepository();
	UserRepository = new MongoDBUserRepository();
} else {
	throw new Error('Unsupported database type');
}

export { DriveRepository, UserRepository };

import { DatabaseTypeConfig } from './config'; // Import the configuration
import { IDatabaseService } from './IDatabaseService';
import { MongoDBService } from './MongoDB/MongoDBService';
import { SqliteDBService } from './SQLite/SQLiteService';

let DatabaseService: IDatabaseService;

if (DatabaseTypeConfig === 'mongodb') {
	DatabaseService = new MongoDBService();
} else if (DatabaseTypeConfig === 'sqlite') {
	DatabaseService = new SqliteDBService();
} else {
	throw new Error('Unsupported database type');
}

export default DatabaseService;

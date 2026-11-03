import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'db', 'draftdesk.db');

// One shared connection for the app.
const db = new Database(dbPath);
db.pragma('journal_mode = WAL'); // better for concurrent reads

export default db;

// Creates the database file and tables. Run once with: npm run init-db
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from './database.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(join(__dirname, '..', 'db', 'schema.sql'), 'utf-8');

db.exec(schema);
console.log('Database ready: db/draftdesk.db');

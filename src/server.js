import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import enquiriesRouter from './routes/enquiries.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.static(join(__dirname, '..', 'web'))); // serve the frontend
app.use('/api/enquiries', enquiriesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`DraftDesk running on http://localhost:${PORT}`);
});

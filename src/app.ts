import apicache from 'apicache';
import cors from 'cors';
import express from 'express';
import { apiRateLimiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/requestLogger';
import apiRouter from './routes';
import visualRouter from './routes/visual.routes';

const app = express();
const cache = apicache.middleware;

app.use(cors());
app.use(apiRateLimiter);
app.use(requestLogger);

// PNG routes stay outside apicache because they return binary image content.
app.use(visualRouter);

app.use(cache('5 minutes'));
app.use(apiRouter);

export default app;

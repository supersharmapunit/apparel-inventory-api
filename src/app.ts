import express from 'express';
import { json } from 'body-parser';
import inventoryRoutes from './routes/inventoryRoutes';
import { errorHandler } from './utils/errorHandlers';
import { requestLogger } from './middlewares/requestLogger';

const app = express();

app.use(json());
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/api', inventoryRoutes);

app.use(errorHandler);

export default app;
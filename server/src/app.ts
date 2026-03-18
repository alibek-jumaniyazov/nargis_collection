import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import routes from './routes/index.routes';

const app: Express = express();

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// Main API routes
app.use('/api', routes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;

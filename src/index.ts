import express from 'express';
import routes from './routes/index';
import { idempotency } from 'express-idempotency';

const app = express();
const port = 3000;

app.get('/', (req: express.Request, res: express.Response): void => {
  res.send('HomePage');
});

app.use('/api', routes);
app.get('*', idempotency());

// start the Express server
app.listen(port, (): void => {
  console.log(`server started at http://localhost:${port}`);
});

export default app;

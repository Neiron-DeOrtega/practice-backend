import express, { Application } from 'express';
const appRouter = require('./src/Routes/appRouter')
// const cors = require('cors');

const app: Application = express();
const PORT = 4000;

// app.use(cors());
app.use(express.json());

app.use('/manager', appRouter)

app.listen(PORT, () => {
  console.log(`Server is Fire at ${PORT} port`);
});
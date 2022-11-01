import { config } from 'dotenv';
import { app } from './app';

config();

const appPort = process.env.PORT || 3333;

app.listen(appPort, () => console.log(`Server is running in port:${appPort}`));


import pkg from 'pg';
const { Pool } = pkg;

import config from './config.mjs';

const pool = new Pool(config);

export { pool };

import dotenv from 'dotenv';
import { HttpApi } from './lib/HttpApi.js';

dotenv.config();

// Entry point for Express HTTP API
( new HttpApi ).start();

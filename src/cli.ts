import dotenv from 'dotenv';
import { cli_ip_lookup } from './lib/CliUtils.js';

dotenv.config();

// Entry point for CLI tool
cli_ip_lookup( process.argv[ 2 ] );

import * as env from 'env-var';
import { config } from 'dotenv';

config();

const PORT = env.get('PORT').asInt();
const NODE_ENV = env.get('NODE_ENV').asString();
const DATABASE_TYPE =
  env.get('DATABASE_TYPE').required().asString() || 'postgres';
const DATABASE_DRIVER = env.get('DATABASE_DRIVER').required().asString();
const DATABASE_HOST = env.get('DATABASE_HOST').required().asString();
const DATABASE_PORT = env.get('DATABASE_PORT').required().asInt();
const DATABASE_USERNAME = env.get('DATABASE_USERNAME').required().asString();
const DATABASE_PASSWORD = env.get('DATABASE_PASSWORD').required().asString();
const DATABASE_NAME = env.get('DATABASE_NAME').required().asString();
const TYPEORM_SYNC = env.get('TYPEORM_SYNC').required().asBool();
const JWT_SECRET = env.get('JWT_SECRET').asString();
const JWT_EXPIRES_IN = env.get('JWT_EXPIRES_IN').asString();
const MIGRATIONS_RUN = env.get('MIGRATIONS_RUN').asBool();
const ENCRYPTION_KEY = env.get('ENCRYPTION_KEY').asString();
const PAYSTACK_SECRET_KEY = env.get('PAYSTACK_SECRET_KEY').asString();
const PAYSTACK_URL = env.get('PAYSTACK_URL').asString();


const serverConfig = {
  NODE_ENV,
  PORT,
  DATABASE_TYPE,
  DATABASE_DRIVER,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  TYPEORM_SYNC,
  MIGRATIONS_RUN,
  ENCRYPTION_KEY,
  PAYSTACK_SECRET_KEY,
  PAYSTACK_URL,
};

export default serverConfig;

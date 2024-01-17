import serverConfig from 'src/database/config/env.config';


const typeOrmConfig = {
  type: serverConfig.DATABASE_TYPE as any,
  host: serverConfig.DATABASE_HOST,
  port: serverConfig.DATABASE_PORT,
  username: serverConfig.DATABASE_USERNAME,
  password: serverConfig.DATABASE_PASSWORD,
  database: serverConfig.DATABASE_NAME,
  entities: [
    __dirname + '/**/*.entity.{js,ts}',
  ],
  // seeds: ['src/seeds/**/*{.ts,.js}'],
  // factories: ['src/factories/**/*{.ts,.js}'],
  synchronize: serverConfig.TYPEORM_SYNC,
  migrationsRun: serverConfig.MIGRATIONS_RUN,
  migrations: ['dist/src/database/migrations/**/*.js'],
  cli: {
    entitiesDir: 'src/**/**/entities',
    migrationsDir: 'src/database/migrations',
  },

};

export default typeOrmConfig;

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { FeaturesModule } from './features/features.module';
import { AuthModule } from './auth/auth.module';
import { EntriesModule } from './entries/entries.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    DatabaseModule,
    FeaturesModule,
    AuthModule,
    EntriesModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

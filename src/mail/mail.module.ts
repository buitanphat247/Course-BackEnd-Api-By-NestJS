import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Subscriber,
  SubscriberSchema,
} from 'src/subscribers/schema/subscriber.entity';
import { Job, JobSchema } from 'src/jobs/schemas/job.schema';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('HOST_EMAIL'),
          auth: {
            user: configService.get<string>('EMAIL_AUTH_USER'),
            pass: configService.get<string>('EMAIL_AUTH_PASS'),
          },
        },

        defaults: {
          from: `"No Reply" <${configService.get<string>('EMAIL_FROM')}>`,
        },
        template: {
          dir: process.cwd() + '/views/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        preview: true,
      }),

      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Subscriber.name, schema: SubscriberSchema },
      { name: Job.name, schema: JobSchema },
    ]),
  ],
  controllers: [MailController],
})
export class MailModule {}

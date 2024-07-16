import { Controller, Get } from '@nestjs/common';
import { UserInterface } from 'src/users/users.interface';
import {
  Public,
  ResponseMessage,
  SkipCheckPermission,
  User,
} from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscribersService } from 'src/subscribers/subscribers.service';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  SubscriberDocument,
  Subscriber,
} from 'src/subscribers/schema/subscriber.entity';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';

@Controller('mails')
export class MailController {
  constructor(
    private mailerService: MailerService,
    @InjectModel(Subscriber.name)
    private subcriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
  ) {}

  @Get()
  @Public()
  @ResponseMessage('Email About Wish Jobs')
  @Cron('0 10 0 * * 0')
  async handleTestEmail() {
    const subscribers = await this.subcriberModel.find({});
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({
        skills: { $in: subsSkills },
      });
      if (jobWithMatchingSkills?.length) {
        const jobs = jobWithMatchingSkills.map((item) => {
          return {
            name: item.name,
            company: item.company.name,
            salary:
              `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ',
            skills: item.skills,
          };
        });

        await this.mailerService.sendMail({
          to: 'sonthai806@gmail.com',
          from: '"Support Team" <support@example.com>', // override default from
          subject: 'Welcome to Nice App! Confirm your Email',
          template: './template_email',
          context: {
            receiver: subs.name,
            jobs: jobs,
          },
        });
      }
    }
  }
}

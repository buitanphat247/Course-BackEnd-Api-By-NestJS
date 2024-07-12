import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private configService: ConfigService) {}
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        // destination: './public/uploads',
        destination: (req: any, file: any, cb: any) => {
          const uploadPath = req?.headers?.folder_type
            ? `./public/images/${req.headers?.folder_type}`
            : this.configService.get<string>('PATH_DEFAULT');
          // Create folder if doesn't exist
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true }); // Use { recursive: true } to create nested directories if needed
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Generating a 32 random chars long string
          const randomName = Array(100)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          //Calling the callback passing the random name generated with the original extension name
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    };
  }
}

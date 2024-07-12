import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { existsSync, mkdir, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private configService: ConfigService) {}

  getRootPath = () => {
    return process.cwd();
  };

  ensureExists = (targetDirectory: string) => {
    mkdir(targetDirectory, { recursive: true }, (error) => {
      if (!error) {
        console.log('Directory successfully created, or it already exists.');
        return;
      }
      switch (error.code) {
        case 'EEXIST':
          // Error: Requested location already exists, but it's not a directory.
          break;
        case 'ENOTDIR':
          // Error: The parent hierarchy contains a file with the same name as the dir you're trying to create.
          break;
        default:
          // Some other error like permission denied.
          console.error(error);
          break;
      }
    });
  };

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

/* eslint-disable prettier/prettier */
// file.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Your upload destination
      fileFilter: (req, file, callback) => {
        // Define allowed file extensions
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];

        // Check if the file extension is in the allowed list
        const isAllowedExtension = allowedExtensions.some((ext) =>
          file.originalname.toLowerCase().endsWith(ext),
        );

        if (!isAllowedExtension) {
          return callback(
            new Error('Only JPG, JPEG, and PNG files are allowed'),
            false,
          );
        }

        callback(null, true);
      },
    }),
  ],
  exports: [MulterModule],
})
export class FileModule {}

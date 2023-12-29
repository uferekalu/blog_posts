/* eslint-disable prettier/prettier */
// file.service.ts
import { Injectable, BadRequestException } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { Express } from 'express'

@Injectable()
export class FileService {
  private readonly uploadDirectory: string = path.join(
    __dirname,
    '..',
    'uploads'
  )

  constructor() {
    this.ensureUploadDirectoryExists()
  }

  private async ensureUploadDirectoryExists(): Promise<void> {
    try {
      if (!fs.existsSync(this.uploadDirectory)) {
        await fs.promises.mkdir(this.uploadDirectory, { recursive: true })
      }
    } catch (error) {
      throw new Error(
        `Failed to ensure the existence of the upload directory. ${error.message}`
      )
    }
  }

  async upload(file?: Express.Multer.File): Promise<string> {
    try {
      if (!file || !file.originalname || !file.buffer) {
        throw new BadRequestException('Invalid file provided.');
      }
      await this.ensureUploadDirectoryExists()

      const fileExtension = file?.originalname.split('.').pop()
      const filename = `${uuidv4()}.${fileExtension}`
      const filePath = path.join(this.uploadDirectory, filename)

      await fs.promises.writeFile(filePath, file?.buffer)
      return filePath
    } catch (error) {
      console.error(`Error during file upload: ${error.message}`)
      throw new BadRequestException('Failed to upload the file.')
    }
  }
  
  async postUpload(file?: Express.Multer.File): Promise<string> {
    try {
      // if (!file || !file.originalname) {
      //   throw new BadRequestException('Invalid file provided.');
      // }
      await this.ensureUploadDirectoryExists()

      const fileExtension = file?.originalname.split('.').pop()
      const filename = `${uuidv4()}.${fileExtension}`
      const filePath = path.join(this.uploadDirectory, filename)

      await fs.writeFileSync(filePath, file?.buffer)
      return filePath
    } catch (error) {
      console.error(`Error during file upload: ${error.message}`)
      throw new BadRequestException('Failed to upload the file.')
    }
  }
}

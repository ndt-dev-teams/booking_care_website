import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

const ALLOWED_TYPES = [
  'specialties',
  'hospitals',
  'doctors',
  'avatars',
] as const;
const MIME_EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

type UploadType = (typeof ALLOWED_TYPES)[number];

export interface UploadedImageFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  async saveImage(type: string, file: UploadedImageFile) {
    const uploadType = this.assertUploadType(type);
    this.assertImageFile(file);

    try {
      const result = await this.uploadToCloudinary(uploadType, file);
      const filename = result.public_id.split('/').pop() ?? result.public_id;

      return {
        url: result.secure_url,
        path: result.public_id,
        filename,
        mimeType: file.mimetype,
        size: file.size,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Lỗi upload Cloudinary:', error);
      throw new InternalServerErrorException('Không thể upload ảnh');
    }
  }

  private assertUploadType(type: string): UploadType {
    if (!ALLOWED_TYPES.includes(type as UploadType)) {
      throw new BadRequestException('Loại upload không hợp lệ');
    }

    return type as UploadType;
  }

  private assertImageFile(file: UploadedImageFile | undefined) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file ảnh để upload');
    }

    if (!MIME_EXTENSION_MAP[file.mimetype]) {
      throw new BadRequestException('Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP');
    }

    if (!file.buffer?.length) {
      throw new BadRequestException('File upload không hợp lệ');
    }
  }

  private async uploadToCloudinary(
    uploadType: UploadType,
    file: UploadedImageFile,
  ): Promise<UploadApiResponse> {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
    const rootFolder = this.configService.get<string>(
      'CLOUDINARY_FOLDER',
      'bookingcare',
    );

    if (!cloudName || !apiKey || !apiSecret) {
      throw new InternalServerErrorException('Cloudinary chưa được cấu hình');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `${rootFolder}/${uploadType}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Cloudinary không trả về kết quả'));
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}

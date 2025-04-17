import { BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

export const UsuariosInterceptor = FileInterceptor('arquivo', {
  storage: diskStorage({
    destination: './uploads',
    filename: (_, file: any, callback: any) => {
      const uniqueSuffix =
        Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (_, file, callback) => {
    if (!file.originalname.match(/\.(txt)$/)) {
      return callback(
        new BadRequestException('Apenas arquivos de texto são permitidos!'),
        false,
      );
    }
    callback(null, true);
  },
});
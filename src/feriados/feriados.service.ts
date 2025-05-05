import { Global, Injectable } from "@nestjs/common";
import { HttpException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Global()
@Injectable()
export class FeriadosService {
    constructor(private prismaService: PrismaService
    ){}
}
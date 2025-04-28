import { PrismaService } from "src/prisma/prisma.service";
import { Global, Injectable } from "@nestjs/common";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Unidade } from "@prisma/client";

@Injectable()
export class UnidadesService {
    constructor(
        private prisma: PrismaService
    ) { }

    async buscarPorCodigo(codigo: string) {

        return await this.prisma.unidade.findUnique({
            where: {
                codigo
            }
        })
    }
}
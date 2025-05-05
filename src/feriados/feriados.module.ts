import { FeriadosController } from "./feriados.controller";
import { FeriadosService } from "./feriados.service";
import { Module } from "@nestjs/common";

@Module({
controllers: [FeriadosController],
exports: [FeriadosService],
providers: [FeriadosService]
})
export class FeriadosModule{ }
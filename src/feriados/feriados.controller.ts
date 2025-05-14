import { Get, Post, Body, Param, Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FeriadosService } from "./feriados.service";

@Controller('feriados')
export class FeriadosController {
    constructor(
        private feriadosService: FeriadosService
    ){}

}


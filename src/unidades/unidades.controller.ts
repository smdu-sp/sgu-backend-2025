import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UnidadesService } from "./unidades.service";

@ApiTags('unidades')
@ApiBearerAuth()
@Controller('unidades')
export class UnidadesController {
    constructor(private unidadesService: UnidadesService) { }

    @Get('/:codigo')
    buscarPorcodigo(
        @Param('codigo') codigo: string
    ) {
        return this.unidadesService.buscarPorCodigo(codigo)
    }

}

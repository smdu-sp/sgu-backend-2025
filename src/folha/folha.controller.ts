import { Get, Post, Controller, Body } from "@nestjs/common";
import { FolhaService } from "./folha.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('Folhas')
@ApiBearerAuth()
@Controller('folhas')
export class FolhaController {
    constructor(
        private readonly FolhaService: FolhaService
    ){}

    @Post('folha-individual')
    gerarFolhaIndividual(@Body() data?: string){

        return this.FolhaService.gerarFolhaIndividual(data)

    }
}

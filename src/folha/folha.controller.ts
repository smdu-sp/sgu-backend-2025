import { Get, Post, Controller, Body, Param } from '@nestjs/common';
import { FolhaService } from './folha.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Folhas')
@ApiBearerAuth()
@Controller('folhas')
export class FolhaController {
  constructor(private folhaService: FolhaService) { }

  @Post(['folha-individual/:userId', 'folha-individual/:userId/:data'])
  gerarFolhaIndividual(
    @Param('userId') userId: string,
    @Param('periodo') periodo?: string,
  ) {
    return this.folhaService.gerarFolhaIndividual({ id: userId, periodo: periodo });
  }

  @Post(['folha-setor/:codigoUnidade', 'folha-setor/:codigoUnidade/:periodo'])
  gerarFolhaPorSetor(
    @Param('codigoUnidade') codigoUnidade: string,
    @Param('periodo') periodo?: string,
  ) {
    return this.folhaService.gerarFolhaPorSetor({ codigoUnidade, periodo })
  }
}

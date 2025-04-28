import { Get, Post, Controller, Body, Param } from '@nestjs/common';
import { FolhaService } from './folha.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Folhas')
@ApiBearerAuth()
@Controller('folhas')
export class FolhaController {
  constructor(private FolhaService: FolhaService) {}

  @Post(['folha-individual/:userId', 'folha-individual/:userId/:data'])
  gerarFolhaIndividual(
    @Param('userId') userId: string,
    @Param('data') data?: string,
  ) {
    return this.FolhaService.gerarFolhaIndividual({ id: userId, data: data });
  }
}

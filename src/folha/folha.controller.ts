import { Get, Post, Controller, Body, Param, Res, StreamableFile, Header } from '@nestjs/common';
import { Response } from 'express';
import { FolhaService } from './folha.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';


@ApiTags('Folhas')
@ApiBearerAuth()
@Controller('folhas')
export class FolhaController {
  constructor(private folhaService: FolhaService) { }

  @Post(['folha-individual/:userId', 'folha-individual/:userId/:periodo'])
  @Header('Content-Type', 'application/pdf')
  async gerarFolhaIndividual(
    @Param('userId') userId: string,
    @Param('periodo') periodo?: string,
    @Res({ passthrough: true }) res?: Response
  ) {
    const { pdfPath, nomeArquivoPDF } = await this.folhaService.gerarFolhaIndividual({
      id: userId,
      periodo: periodo
    });

    res.set({
      'Content-Disposition': `attachment; filename="${nomeArquivoPDF}"`
    });

    const fileStream = createReadStream(pdfPath);
    return new StreamableFile(fileStream);
  }

  @Post(['folha-setor/:codigoUnidade', 'folha-setor/:codigoUnidade/:periodo'])
  @Header('Content-Type', 'application/pdf')
  async gerarFolhaPorSetor(
    @Param('codigoUnidade') codigoUnidade: string,
    @Param('periodo') periodo?: string,
    @Res({ passthrough: true }) res?: Response,
  ) {

    const { pdfPath, nomeArquivoPDF } = await this.folhaService.gerarFolhaPorSetor({
      codigoUnidade,
      periodo: periodo
    });

    res.set({
      'Content-Disposition': `attachment; filename="${nomeArquivoPDF}"`
    });

    const fileStream = createReadStream(pdfPath);
    return new StreamableFile(fileStream);

  }

}

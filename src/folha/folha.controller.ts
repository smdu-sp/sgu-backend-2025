import { Get, Post, Controller, Body, Param, Res, StreamableFile, Header } from '@nestjs/common';
import { Response } from 'express';
import { FolhaService } from './folha.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { EventEmitter2 } from '@nestjs/event-emitter';


@ApiTags('Folhas')
@ApiBearerAuth()
@Controller('folhas')
export class FolhaController {
  constructor(
    private folhaService: FolhaService,
    private eventEmitter: EventEmitter2,
  ) { }

  @Post(['folha-individual/:userId', 'folha-individual/:userId/:periodo'])
  @Header('Content-Type', 'application/pdf')
  async gerarFolhaIndividual(
    @Param('userId') userId: string,
    @Param('periodo') periodo?: string,
    @Res({ passthrough: false }) res?: Response,
  ) {
    const { pdfPath, nomeArquivoPDF, htmlPath } = await this.folhaService.gerarFolhaIndividual({
      id: userId,
      periodo,
    });

    res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivoPDF}"`);
    res.setHeader('Content-Type', 'application/pdf');

    const stream = createReadStream(pdfPath);
    stream.pipe(res);

    res.on('finish', () => {
      this.eventEmitter.emit('folha.gerada', {
        pdfPath,
        htmlPath,
      });
    });
  }

  @Post(['folha-setor/:codigoUnidade', 'folha-setor/:codigoUnidade/:periodo'])
  @Header('Content-Type', 'application/pdf')
  async gerarFolhaPorSetor(
    @Param('codigoUnidade') codigoUnidade: string,
    @Param('periodo') periodo?: string,
    @Res({ passthrough: false }) res?: Response,
  ) {
    const { pdfPath, nomeArquivoPDF, htmlPath } = await this.folhaService.gerarFolhaPorSetor({
      codigoUnidade,
      periodo,
    });

    res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivoPDF}"`);
    res.setHeader('Content-Type', 'application/pdf');

    const fileStream = createReadStream(pdfPath);
    fileStream.pipe(res);

    res.on('finish', () => {
      this.eventEmitter.emit('folha.gerada', {
        pdfPath,
        htmlPath,
      });
    });
  }

}

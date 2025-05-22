import { PrismaService } from 'src/prisma/prisma.service';
import { Global, Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { FuncionariosService } from 'src/funcionarios/funcionarios.service';
import { FolhaIndividualDto, FolhaPorSetorDto, PdfResponseDto, PdfResponseCleanDto } from './dto/folhas.dto';
import { UnidadesService } from 'src/unidades/unidades.service';
import { gerarArquivoHTML, gerarListaHTMLCompilada, gerarHTMLSetor, compilarHTML } from './utils/compiladorHTML';
import { gerarPDFFolhaViaHTML } from './utils/playwright';
import { gerarParametrosDeString } from './utils/geradorDeStrings';
import * as fs from 'fs/promises';
import * as path from 'path';
import { join } from 'path';

@Global()
@Injectable()
export class FolhaService {
  constructor(
    private prismaService: PrismaService,
    private usuarioService: UsuariosService,
    private funcionarioService: FuncionariosService,
    private unidadeService: UnidadesService,
  ) { }

  getMesAno(dataString?: string): { mes: string; ano: string } {
    if (dataString) {
      const [mesParam, anoParam] = dataString.split(/[\/-]/).map(Number);
      const dataPonto = new Date(anoParam, mesParam - 1, 1);

      const ano = (dataPonto.getFullYear()).toString();
      let mes = (dataPonto.getMonth() + 1).toString();
      if (Number(mes) <= 9) {
        mes = `0${mes}`
      }
      return {
        mes,
        ano,
      };
    } else {
      const dataPonto = new Date();

      const ano = (dataPonto.getFullYear()).toString();
      let mes = (dataPonto.getMonth() + 1).toString();
      if (Number(mes) <= 9) {
        mes = `0${mes}`
      }
      return {
        mes: mes,
        ano: ano,
      };
    }
  }

  async getCompile(userId: string, periodo: string) {

    const mesAno = this.getMesAno(periodo);
    const user = await this.usuarioService.buscarPorId(userId)
    const funcionario = await this.funcionarioService.buscarPorId(userId)
    const unidade = await this.unidadeService.buscarPorCodigo(
      user.codigoUnidade,
    );
    const logoPath = path.join(
      process.cwd(),
      'src',
      'folha',
      'templates',
      'assets',
      'logosp.webp',
    );
    const logoBuffer = await fs.readFile(logoPath);
    const logoBase64 = logoBuffer.toString('base64');
    const logoDataURI = `data:image/webp;base64,${logoBase64}`;

    const paramsCompile = {
      nome: user.nome.toLocaleUpperCase(),
      periodo: `${mesAno.mes}/${mesAno.ano}`,
      rf: funcionario.rf,
      eh: user.codigoUnidade,
      unidade: unidade.nome,
      vinculo: '1',
      logo: logoDataURI,
    };

    return paramsCompile
  }

  async gerarListaDeCompilados(lista: any[], periodo: string) {
    const listaDeCompiladores = await Promise.all(
      lista.map((servidor) => this.getCompile(servidor.id, periodo))
    );
    return listaDeCompiladores;
  }

  async gerarFolhaIndividual(data: FolhaIndividualDto): Promise<PdfResponseDto> {
    const paramsCompile = await this.getCompile(data.id, data.periodo);
    const paramsString = gerarParametrosDeString(paramsCompile.nome, 'servidor');
    const htmlCompilado = await compilarHTML('template', paramsCompile);

    await fs.mkdir(path.dirname(paramsString.caminhoHTML), { recursive: true });
    await gerarArquivoHTML(htmlCompilado, paramsString.nomeArquivoHTML);

    try {
      await fs.access(paramsString.caminhoHTML);
      await fs.mkdir(paramsString.pdfDir, { recursive: true });
      await gerarPDFFolhaViaHTML(paramsString.nomeArquivoHTML, paramsString.caminhoHTML, paramsString.caminhoPDF, 'servidor');

      return {
        pdfPath: paramsString.caminhoPDF,
        nomeArquivoPDF: paramsString.nomeArquivoPDF,
        htmlPath: paramsString.caminhoHTML,
      };
    } catch (err) {
      throw new Error(`Erro ao gerar folha: ${err.message}`);
    }
  }

  async gerarFolhaPorSetor(dados: FolhaPorSetorDto): Promise<PdfResponseDto> {
    const lista = await this.usuarioService.buscarTudo(1, -1, dados.codigoUnidade, "1");
    const listaDeCompiladores = await this.gerarListaDeCompilados(lista.data, dados.periodo);

    const paramsString = gerarParametrosDeString(
      `${listaDeCompiladores[0].unidade}`,
      'setor'
    );

    const listaHTML = await gerarListaHTMLCompilada('infos-funcionario.html', listaDeCompiladores);

    await fs.mkdir(path.dirname(paramsString.caminhoHTML), { recursive: true });
    await gerarHTMLSetor(paramsString.nomeArquivoHTML, listaHTML);

    try {
      await fs.access(paramsString.caminhoHTML);
      await fs.mkdir(paramsString.pdfDir, { recursive: true });
      await gerarPDFFolhaViaHTML(paramsString.nomeArquivoHTML, paramsString.caminhoHTML, paramsString.caminhoPDF, 'setor');
      await fs.access(paramsString.caminhoPDF)
      return {
        pdfPath: paramsString.caminhoPDF,
        nomeArquivoPDF: paramsString.nomeArquivoPDF,
        htmlPath: paramsString.caminhoHTML
      };

    } catch (error) {
      throw new Error(`Erro ao gerar folha de setor: ${error.message}`);
    }
  }

}

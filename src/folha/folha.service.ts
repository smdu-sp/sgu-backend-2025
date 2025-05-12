import { PrismaService } from 'src/prisma/prisma.service';
import { Global, Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { FuncionariosService } from 'src/funcionarios/funcionarios.service';
import { FolhaIndividualDto, FolhaPorSetorDto } from './dto/folhas.dto';
import { UnidadesService } from 'src/unidades/unidades.service';
import { gerarFolhaPontoHTML, gerarArquivoHTML, gerarListaHTMLCompilada, gerarHTMLSetor } from './utils/compiladorHTML';
import { gerarPDFFolhaViaHTML } from './utils/playwright';
import * as fs from 'fs/promises';
import * as path from 'path';

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

      const ano = dataPonto.getFullYear();
      const mes = dataPonto.toLocaleDateString('pt-BR', { month: 'long' });
      return {
        mes: mes.charAt(0).toUpperCase() + mes.slice(1),
        ano: ano.toString(),
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



  async gerarFolhaIndividual(data: FolhaIndividualDto) {

    const paramsCompile = await this.getCompile(data.id, data.periodo)

    const nomeArquivo = `${paramsCompile.nome}_f-f-i.html`;
    const htmlCompilado = await gerarFolhaPontoHTML(paramsCompile);

    await gerarArquivoHTML(htmlCompilado, nomeArquivo);

    const caminhoHTML = path.join(
      process.cwd(),
      'src/folha/templates/folha-servidor',
      nomeArquivo,
    );

    try {
      await fs.access(caminhoHTML);
      await gerarPDFFolhaViaHTML(nomeArquivo, 'servidor');
    } catch (err) {
      throw new Error(`Arquivo HTML não encontrado em: ${caminhoHTML}`);
    }
    return `Folha do ${paramsCompile.nome} foi gerada com sucesso`;
  }

  ////////////////////////////////

  async gerarListaDeCompilados(lista: any[], periodo: string) {
    const listaDeCompiladores = await Promise.all(
      lista.map((servidor) => this.getCompile(servidor.id, periodo))
    );
    return listaDeCompiladores;
  }


  async gerarFolhaPorSetor(dados: FolhaPorSetorDto) {
    const lista = await this.usuarioService.buscarTudo(1, -1, dados.codigoUnidade, "1")
    const listaDeCompiladores = await this.gerarListaDeCompilados(lista.data, dados.periodo)

    const nomeArquivo = `${listaDeCompiladores[0].unidade}-f-f-i.html`
    const caminhoHTML = path.join(
      process.cwd(),
      'src/folha/templates/folha-setor',
      nomeArquivo,
    );

    const listaHTML = await gerarListaHTMLCompilada('infos-funcionario.html', listaDeCompiladores)

    await gerarHTMLSetor(nomeArquivo, listaHTML)

    try {
      await fs.access(caminhoHTML);
      await gerarPDFFolhaViaHTML(nomeArquivo, 'setor')

    } catch (error) {
      throw new Error(`Arquivo HTML não encontrado em: ${caminhoHTML}`);
    }
    return listaDeCompiladores
  }


}

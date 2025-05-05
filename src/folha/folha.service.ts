import { PrismaService } from 'src/prisma/prisma.service';
import { Global, Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { FuncionariosService } from 'src/funcionarios/funcionarios.service';
import { FolhaIndividualDto } from './dto/folhas.dto';
import { UsuarioResponseDTO } from 'src/usuarios/dto/usuario-response.dto';
import { UnidadesService } from 'src/unidades/unidades.service';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { gerarFolhaPonto, gerarArquivoHTML } from './utils/compiladorHTML';
import { gerarPDFFolhaViaHTML } from './utils/playwright';
import * as fs from "fs/promises"
import * as path from "path"

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

      const ano = dataPonto.getFullYear();
      const mes = dataPonto.toLocaleDateString('pt-BR', { month: 'long' });
      return {
        mes: mes.charAt(0).toUpperCase() + mes.slice(1),
        ano: ano.toString(),
      };
    }
  }

  async getUsuario(userId: string): Promise<UsuarioResponseDTO> {

    try {
      const user = await this.usuarioService.buscarPorId(userId);
      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Falha ao processar a folha',
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async gerarFolhaIndividual(data: FolhaIndividualDto) {
    const user = await this.getUsuario(data.id);
    const mesAno = this.getMesAno(data.data);
    const funcionario = await this.funcionarioService.buscarPorId(user.id);
    const unidade = await this.unidadeService.buscarPorCodigo(user.codigoUnidade);

    const paramsCompile = {
      nome: user.nome,
      data: `${mesAno.mes}/${mesAno.ano}`,
      rf: funcionario.rf,
      eh: user.codigoUnidade,
      unidade: unidade.nome,
      vinculo: '1',
    };

    const nomeArquivo = `${user.nome}-${mesAno.mes}-${mesAno.ano}.f-f-i.html`;
    // const caminhoHTML = `./src/folha/templates/folha-ponto/${nomeArquivo}`;


    const htmlCompilado = await gerarFolhaPonto(paramsCompile);

    await gerarArquivoHTML(htmlCompilado, nomeArquivo);

    const caminhoHTML = path.join(process.cwd(), 'src/folha/templates/folha-ponto', nomeArquivo);
    // console.log('caminhoHTML', caminhoHTML)

    // console.log('Caminho completo:', path.resolve(caminhoHTML));
    const existe = await fs.access(caminhoHTML).then(() => true).catch(() => false);
    // console.log('O HTML existe?', existe);

    try {
      await fs.access(caminhoHTML);

      await gerarPDFFolhaViaHTML(nomeArquivo);
    } catch (err) {
      throw new Error(`Arquivo HTML não encontrado em: ${caminhoHTML}`);
    }

    return mesAno;
  }
}
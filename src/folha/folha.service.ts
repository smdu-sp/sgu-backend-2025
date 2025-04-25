import { PrismaService } from 'src/prisma/prisma.service';
import { Global, Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { CompiladorHTML } from './utils/compiladorHTML';
import { FuncionariosService } from 'src/funcionarios/funcionarios.service';
import { FolhaIndividualDto } from './dto/folhas.dto';
import { UsuarioResponseDTO } from 'src/usuarios/dto/usuario-response.dto';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

@Global()
@Injectable()
export class FolhaService {
  constructor(
    private prismaService: PrismaService,
    private usuarioService: UsuariosService,
    private funcionarioService: FuncionariosService,
  ) {}

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

    console.log(userId)
    try {
      const user = await this.usuarioService.buscarPorId(userId);
      return user;
    } catch (error) {
      console.error('Erro ao gerar folha:', error);
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
    console.log(user);
    const res = this.getMesAno(data.data);
    return res;
  }
}

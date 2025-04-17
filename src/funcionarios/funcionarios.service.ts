import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';
import { Funcionario, Usuario } from '@prisma/client';

@Injectable()
export class FuncionariosService {
  constructor(
    private prisma: PrismaService,
    private app: AppService,
  ) {}
  
  async criar(data: CreateFuncionarioDto) {
    const usuario: Usuario = await this.prisma.usuario.findUnique({ where: { id: data.usuarioId } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    const funcionario: Funcionario = await this.buscarPorId(data.usuarioId);
    if (funcionario) throw new InternalServerErrorException('Funcionario já cadastrado.');
    const funcionarioNovo: Funcionario = await this.prisma.funcionario.create({ data });
    if (!funcionarioNovo) throw new InternalServerErrorException('Nao foi possivel criar o funcionário.');
    return funcionarioNovo;
  }

  async buscarTudo(
    pagina: number = 1,
    limite: number = 10,
    busca?: string
  ) {
    [pagina, limite] = this.app.verificaPagina(pagina, limite);
    const searchParams = {
      ...(busca && busca !== '' && { OR: [
        { rf: { contains: busca }},
        { nomeCargo: { contains: busca }},
      ]}),
    };
    const total: number = await this.prisma.funcionario.count({ where: searchParams });
    if (total == 0) return { total: 0, pagina: 0, limite: 0, data: [] };
    [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
    const funcionarios: Funcionario[] = await this.prisma.funcionario.findMany({
      where: searchParams,
      orderBy: { rf: 'asc' },
      skip: (pagina - 1) * limite,
      take: limite,
    });
    return {
      total: +total,
      pagina: +pagina,
      limite: +limite,
      data: funcionarios,
    };
  }

  async buscarPorId(usuarioId: string) {
    const funcionario: Funcionario = await this.prisma.funcionario.findUnique({ where: { usuarioId } });
    if (!funcionario) throw new NotFoundException('Funcionário não encontrado.');
    return funcionario;
  }


  async atualizar(usuarioId: string, data: UpdateFuncionarioDto) {
    await this.buscarPorId(usuarioId);
    const funcionarioAtualizado: Funcionario = await this.prisma.funcionario.update({ where: { usuarioId }, data });
    if (!funcionarioAtualizado) throw new InternalServerErrorException('Não foi possivel atualizar o funcionário.');
    return funcionarioAtualizado;
  }
}

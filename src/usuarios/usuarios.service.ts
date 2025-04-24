import {
  BadRequestException,
  ForbiddenException,
  Global,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { $Enums, Permissao, Usuario } from '@prisma/client';
import { createReadStream, promises as fs } from 'fs';
import { Client as LdapClient } from 'ldapts';
import { join } from 'path';
import { createInterface } from 'readline';
import { AppService } from 'src/app.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import {
  BuscarNovoResponseDTO,
  UsuarioAutorizadoResponseDTO,
  UsuarioPaginadoResponseDTO,
  UsuarioResponseDTO,
} from './dto/usuario-response.dto';

@Global()
@Injectable()
export class UsuariosService {
  constructor(
    private prisma: PrismaService,
    private app: AppService,
  ) {}

  validaPermissaoCriador(
    permissao: $Enums.Permissao,
    permissaoCriador: $Enums.Permissao,
  ) {
    if (
      permissao === $Enums.Permissao.DEV &&
      permissaoCriador === $Enums.Permissao.ADM
    )
      permissao = $Enums.Permissao.ADM;
    return permissao;
  }

  async permitido(id: string, permissoes: string[]): Promise<boolean> {
    if (!id || id === '') throw new BadRequestException('ID vazio.');
    const usuario = await this.prisma.usuario.findUnique({ 
      where: { id },
      select: { permissao: true }
    });
    if (usuario.permissao === 'DEV') return true;
    return permissoes.some(permissao => permissao === usuario.permissao);
  }

  async listaCompleta(): Promise<UsuarioResponseDTO[]> {
    const lista: Usuario[] = await this.prisma.usuario.findMany({
      orderBy: { nome: 'asc' },
    });
    if (!lista || lista.length == 0) throw new ForbiddenException('Nenhum usuário encontrado.');
    return lista;
  }

  async criar(
    createUsuarioDto: CreateUsuarioDto,
    usuarioLogado: Usuario
  ): Promise<UsuarioResponseDTO> {
    const loguser: UsuarioResponseDTO = await this.buscarPorLogin(createUsuarioDto.login);
    if (loguser) throw new ForbiddenException('Login já cadastrado.');
    const emailuser: UsuarioResponseDTO = await this.buscarPorEmail(createUsuarioDto.email);
    if (emailuser) throw new ForbiddenException('Email já cadastrado.');
    let { permissao } = createUsuarioDto;
    permissao = this.validaPermissaoCriador(permissao, usuarioLogado.permissao);
    const usuario: Usuario = await this.prisma.usuario.create({
      data: {
        ...createUsuarioDto,
        permissao
      },
    });
    if (!usuario) throw new InternalServerErrorException('Não foi possível criar o usuário, tente novamente.');
    return usuario;
  }

  async buscarTudo(
    pagina: number = 1,
    limite: number = 10,
    busca?: string,
    status?: string,
    permissao?: string
  ): Promise<UsuarioPaginadoResponseDTO> {
    [pagina, limite] = this.app.verificaPagina(pagina, limite);
    const searchParams = {
      ...(busca && { OR: [
        { nome: { contains: busca }},
        { nomeSocial: { contains: busca }},
        { login: { contains: busca }},
        { email: { contains: busca }},
      ]}),
      ...(status && status !== '' && { 
        status: status === 'ATIVO' ? true : (status === 'INATIVO' ? false : undefined) 
      }),
      ...(permissao && permissao !== '' && { permissao: Permissao[permissao] }),
    };
    const total: number = await this.prisma.usuario.count({ where: searchParams });
    if (total == 0) return { total: 0, pagina: 0, limite: 0, data: [] };
    [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
    const usuarios: Usuario[] = await this.prisma.usuario.findMany({
      where: searchParams,
      orderBy: { nome: 'asc' },
      skip: (pagina - 1) * limite,
      take: limite,
    });
    return {
      total: +total,
      pagina: +pagina,
      limite: +limite,
      data: usuarios,
    };
  }

  async buscarPorId(id: string): Promise<UsuarioResponseDTO> {
    const usuario: Usuario = await this.prisma.usuario.findUnique({ where: { id }});
    return usuario;
  }

  async buscarPorEmail(email: string): Promise<UsuarioResponseDTO> {
    return await this.prisma.usuario.findUnique({ where: { email }});
  }

  async buscarPorLogin(login: string): Promise<UsuarioResponseDTO> {
    return await this.prisma.usuario.findUnique({ where: { login }});
  }


  async atualizar(
    usuario: Usuario,
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<UsuarioResponseDTO> {
    const usuarioLogado = await this.buscarPorId(usuario.id);
    if (updateUsuarioDto.login) {
      const usuario = await this.buscarPorLogin(updateUsuarioDto.login);
      if (usuario && usuario.id !== id) throw new ForbiddenException('Login já cadastrado.');
    }
    const usuarioAntes = await this.prisma.usuario.findUnique({ where: { id }});
    if (['TEC', 'USR'].includes(usuarioAntes.permissao) && id !== usuarioAntes.id) throw new ForbiddenException('Operação não autorizada para este usuário.');
    let { permissao } = updateUsuarioDto;
    permissao = permissao && permissao.toString() !== '' ? this.validaPermissaoCriador(permissao, usuarioLogado.permissao) : usuarioAntes.permissao;
    const usuarioAtualizado: Usuario = await this.prisma.usuario.update({
      data: {
        ...updateUsuarioDto,
        permissao
      },
      where: { id },
    });
    return usuarioAtualizado;
  }

  async excluir(id: string): Promise<{ desativado: boolean }> {
    await this.prisma.usuario.update({
      data: { status: false },
      where: { id },
    });
    return { desativado: true };
  }

  async autorizaUsuario(id: string): Promise<UsuarioAutorizadoResponseDTO> {
    const autorizado: Usuario = await this.prisma.usuario.update({
      where: { id },
      data: { status: true },
    });
    if (autorizado && autorizado.status === true) return { autorizado: true };
    throw new ForbiddenException('Erro ao autorizar o usuário.');
  }

  async validaUsuario(id: string): Promise<UsuarioResponseDTO> {
    const usuario: Usuario = await this.prisma.usuario.findUnique({ where: { id }});
    if (!usuario) throw new ForbiddenException('Usuário não encontrado.');
    if (usuario.status !== true) throw new ForbiddenException('Usuário inativo.');
    return usuario;
  }

  async buscarPorNome(nome_busca: string): Promise<{ nome: string, email: string, login: string }> {
    const client: LdapClient = new LdapClient({
      url: process.env.LDAP_SERVER,
    });
    try {
      await client.bind(`${process.env.LDAP_USER}${process.env.LDAP_DOMAIN}`, process.env.LDAP_PASS);
    } catch (error) {
      throw new InternalServerErrorException('Não foi possível buscar o usuário.');
    }
    let nome: string, email: string, login: string;
    try {
      const usuario = await client.search(
        process.env.LDAP_BASE,
        {
          filter: `(&(name=${nome_busca})(company=SMUL))`,
          scope: 'sub',
          attributes: ['name', 'mail'],
        }
      );
      const { name, mail, samaccountname } = usuario.searchEntries[0];
      nome = name.toString();
      email = mail.toString().toLowerCase();
      login = samaccountname.toString().toLowerCase();
      return { nome, email, login };
    } catch (error) {
      await client.unbind();
      throw new InternalServerErrorException('Não foi possível buscar o usuário.');
    }
  }

  async buscarNovo(login: string): Promise<BuscarNovoResponseDTO> {
    const usuarioExiste = await this.buscarPorLogin(login);
    if (usuarioExiste && usuarioExiste.status === true) throw new ForbiddenException('Login já cadastrado.');
    if (usuarioExiste && usuarioExiste.status !== true){
      const usuarioReativado = await this.prisma.usuario.update({ 
        where: { id: usuarioExiste.id }, 
        data: { status: true } 
      });
      return usuarioReativado;
    }
    const client: LdapClient = new LdapClient({
      url: process.env.LDAP_SERVER,
    });
    try {
      await client.bind(`${process.env.LDAP_USER}${process.env.LDAP_DOMAIN}`, process.env.LDAP_PASS);
    } catch (error) {
      throw new InternalServerErrorException('Não foi possível buscar o usuário.');
    }
    let nome: string, email: string;
    try {
      const usuario = await client.search(
        process.env.LDAP_BASE,
        {
          filter: `(&(samaccountname=${login})(company=SMUL))`,
          scope: 'sub',
          attributes: ['name', 'mail'],
        }
      );
      const { name, mail } = usuario.searchEntries[0];
      nome = name.toString();
      email = mail.toString().toLowerCase();
    } catch (error) {
      await client.unbind();
      throw new InternalServerErrorException('Não foi possível buscar o usuário.');
    }
    if (!nome || !email) throw new NotFoundException('Usuário não encontrado.');
    return { login, nome, email };
  }

  async atualizarUltimoLogin(id: string) {
    await this.prisma.usuario.update({
      where: { id },
      data: { ultimoLogin: new Date() },
    });
  }

  async importar(mes: number, ano: number, arquivo: Express.Multer.File) {
    if (!arquivo?.filename)
      throw new BadRequestException('Arquivo não encontrado.');

    const caminhoCompleto = join(process.cwd(), 'uploads', arquivo.filename);
    let fileStream;
    let isArquivoRemovido = true;

    try {
      if (!Number.isInteger(+mes) || +mes < 1 || mes > 12) {
        throw new BadRequestException(
          'Mês inválido. Deve ser um número entre 1 e 12.',
        );
      }

      if (
        !Number.isInteger(+ano) ||
        +ano < 1 ||
        ano.toString().length > 4 ||
        ano.toString().length < 4
      ) {
        throw new BadRequestException(
          'Ano inválido. Deve ser um número de 4 dígitos',
        );
      }

      await fs.access(caminhoCompleto);

      fileStream = createReadStream(caminhoCompleto, 'utf-8');

      const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      const registrosSigpec = [];

      let linhaIndex = 0;
      for await (const linha of rl) {
        if (linhaIndex++ === 0) {
          continue;
        }

        const campos = linha
          .trim()
          .split(';')
          .filter(
            (campo, index, array) => index !== array.length - 1 || campo !== '',
          );

        if (campos.length > 0) {
          const registroSigpec = this.mapearParaModeloCargaSigpec(
            campos,
            mes,
            ano,
          );
          registrosSigpec.push(registroSigpec);
        }
      }

      if (registrosSigpec.length > 0) {
        await this.prisma.cargaSigpec.createMany({
          data: registrosSigpec,
          skipDuplicates: false,
        });
      }

      isArquivoRemovido = false;
      await fs.unlink(caminhoCompleto);
    } catch (error) {
      console.log(error);

      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro interno ao processar arquivo.',
      );
    } finally {
      if (fileStream) {
        fileStream.destroy();
      }

      if (isArquivoRemovido) {
        try {
          await fs.unlink(caminhoCompleto);
        } catch (error) {
          console.error('Erro ao remover arquivo: ', error);
        }
      }
    }
  }

  private mapearParaModeloCargaSigpec(
    campos: string[],
    mes: number,
    ano: number,
  ) {
    const parseDate = (data: string): Date | null => {
      if (!data) return null;
      try {
        return new Date(data.split('/').reverse().join('-'));
      } catch (error) {
        return null;
      }
    };

    return {
      rf: campos[0] || '',
      nome: campos[1] || null,
      vinculo: campos[2] || null,
      especie: campos[3] || null,
      inicio: parseDate(campos[4]),
      termino: parseDate(campos[5]),
      cargo: campos[6] || null,
      nomeCargo: campos[7] || null,
      refCargo: campos[8] || null,
      unidade: campos[9] || null,
      nomeSetor: campos[10] || null,
      relJurAdm: campos[11] || null,
      tipoEvento: campos[12] || null,
      inicioExerc: parseDate(campos[13]),
      titular: campos[14] || null,
      numVincTit: campos[15] || null,
      nomeFuncTit: campos[16] || null,
      inicioRem: parseDate(campos[17]),
      fimRem: parseDate(campos[18]),
      observacao: campos[19] || null,
      vaga: campos[20] || null,
      mes: Number(mes),
      ano: Number(ano),
    };
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Usuario } from '@prisma/client';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import { UsuarioAtual } from 'src/auth/decorators/usuario-atual.decorator';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import {
  BuscarNovoResponseDTO,
  UsuarioAutorizadoResponseDTO,
  UsuarioDesativadoResponseDTO,
  UsuarioPaginadoResponseDTO,
  UsuarioResponseDTO,
} from './dto/usuario-response.dto';
import { UsuariosInterceptor } from './interceptors/usuarios.interceptor';
import { UsuariosService } from './usuarios.service';


@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Permissoes('ADM')
  @Post('criar')
  criar(
    @UsuarioAtual() usuario: Usuario,
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<UsuarioResponseDTO> {
    return this.usuariosService.criar(createUsuarioDto, usuario);
  }

  @Permissoes('ADM')
  @Get('buscar-tudo')
  buscarTudo(
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
    @Query('busca') busca?: string,
    @Query('status') status?: string,
    @Query('permissao') permissao?: string,
  ): Promise<UsuarioPaginadoResponseDTO> {
    return this.usuariosService.buscarTudo(
      +pagina,
      +limite,
      busca,
      status,
      permissao,
    );
  }

  @Permissoes('ADM')
  @Get('buscar-por-id/:id')
  buscarPorId(@Param('id') id: string): Promise<UsuarioResponseDTO> {
    return this.usuariosService.buscarPorId(id);
  }

  @Permissoes('ADM', 'TEC', 'USR')
  @Patch('atualizar/:id')
  atualizar(
    @UsuarioAtual() usuario: Usuario,
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<UsuarioResponseDTO> {
    return this.usuariosService.atualizar(usuario, id, updateUsuarioDto);
  }

  @Permissoes('ADM')
  @Get('lista-completa')
  listaCompleta(): Promise<UsuarioResponseDTO[]> {
    return this.usuariosService.listaCompleta();
  }

  @Permissoes('ADM')
  @Delete('desativar/:id')
  excluir(@Param('id') id: string): Promise<UsuarioDesativadoResponseDTO> {
    return this.usuariosService.excluir(id);
  }

  @Permissoes('ADM')
  @Patch('autorizar/:id')
  autorizarUsuario(
    @Param('id') id: string,
  ): Promise<UsuarioAutorizadoResponseDTO> {
    return this.usuariosService.autorizaUsuario(id);
  }

  @Get('valida-usuario')
  validaUsuario(@UsuarioAtual() usuario: Usuario): Promise<UsuarioResponseDTO> {
    return this.usuariosService.validaUsuario(usuario.id);
  }

  @Permissoes('ADM')
  @Get('buscar-novo/:login')
  buscarNovo(@Param('login') login: string): Promise<BuscarNovoResponseDTO> {
    return this.usuariosService.buscarNovo(login);
  }

  @IsPublic()
  @Post('importar')
  @UseInterceptors(UsuariosInterceptor)
  async importar(
    @Query('mes') mes: number,
    @Query('ano') ano: number,
    @UploadedFile() arquivo: Express.Multer.File,
  ) {
    return await this.usuariosService.importar(mes, ano, arquivo);
  }
}

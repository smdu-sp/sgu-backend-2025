import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FuncionariosService } from './funcionarios.service';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';

@Controller('funcionarios')
export class FuncionariosController {
  constructor(private readonly funcionariosService: FuncionariosService) {}

  @Post()
  criar(@Body() createFuncionarioDto: CreateFuncionarioDto) {
    return this.funcionariosService.criar(createFuncionarioDto);
  }

  @Get()
  buscarTudo(
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
    @Query('busca') busca?: string
  ) {
    return this.funcionariosService.buscarTudo(+pagina, +limite, busca);
  }

  @Get(':usuarioId')
  buscarPorId(@Param('usuarioId') usuarioId: string) {
    return this.funcionariosService.buscarPorId(usuarioId);
  }

  @Patch(':usuarioId')
  atualizar(@Param('usuarioId') usuarioId: string, @Body() updateFuncionarioDto: UpdateFuncionarioDto) {
    return this.funcionariosService.atualizar(usuarioId, updateFuncionarioDto);
  }
}

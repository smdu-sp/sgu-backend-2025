import { FolhaController } from "./folha.controller";
import { FolhaService } from "./folha.service";
import { UsuariosModule } from "src/usuarios/usuarios.module";
import { FuncionariosModule } from "src/funcionarios/funcionarios.module";
import { UnidadesModule } from "src/unidades/unidades.module";
import { Module } from "@nestjs/common";

@Module({
  controllers: [FolhaController],
  imports: [UsuariosModule, FuncionariosModule, UnidadesModule],
  providers: [FolhaService],
  exports: [FolhaService]
})
export class FolhaModule { }
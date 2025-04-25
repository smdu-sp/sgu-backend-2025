import { FolhaController } from "./folha.controller";
import { FolhaService } from "./folha.service";
import { CompiladorHTML } from "./utils/compiladorHTML";
import { UsuariosModule } from "src/usuarios/usuarios.module";
import { FuncionariosModule } from "src/funcionarios/funcionarios.module";
import { Module } from "@nestjs/common";

@Module({
  controllers: [FolhaController],
  imports: [UsuariosModule, FuncionariosModule], 
  providers: [FolhaService, CompiladorHTML],
  exports: [FolhaService, CompiladorHTML]
})
export class FolhaModule {}
import { FolhaController } from "./folha.controller";
import { FolhaService } from "./folha.service";
import { CompiladorHTML } from "./utils/compiladorHTML";
import { Module } from "@nestjs/common";

@Module({
    controllers: [FolhaController],
    providers: [FolhaService, CompiladorHTML],
    exports: [FolhaService, CompiladorHTML]
})
export class FolhaModule {}
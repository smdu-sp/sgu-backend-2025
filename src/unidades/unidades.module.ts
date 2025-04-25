import { UnidadesService } from "./unidades.service";
import { UnidadesController } from "./unidades.controller";
import { Module } from "@nestjs/common";

@Module({
    exports: [UnidadesService],
    providers: [UnidadesService],
    controllers: [UnidadesController]
})
export class UnidadesModule { }
import { Global, Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { FuncionariosModule } from './funcionarios/funcionarios.module';
import { FolhaModule } from './folha/folha.module';
import { UnidadesModule } from './unidades/unidades.module';
import { FeriadosModule } from './feriados/feriados.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Global()
@Module({
  exports: [AppService],
  imports: [PrismaModule, AuthModule, UsuariosModule, FuncionariosModule, FolhaModule, UnidadesModule, FeriadosModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'), 
    serveRoot: '/'
  }),
],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule { }
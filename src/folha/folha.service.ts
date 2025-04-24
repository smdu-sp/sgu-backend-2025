import { PrismaService } from 'src/prisma/prisma.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { CompiladorHTML } from './utils/compiladorHTML';
import { FuncionariosService } from 'src/funcionarios/funcionarios.service';

export class FolhaService {
  constructor(
    private readonly PrismaService: PrismaService,
    private readonly UsuarioService: UsuariosService,
    private readonly CompiladorHTML: CompiladorHTML,
    private readonly FuncionarioService: FuncionariosService,
  ) {}

  getMesAno(dataString?: string): { mes: string; ano: string } {
    // const data = dataString
    //   ? (([mes, ano]) => new Date(ano, mes - 1, 1))(
    //       dataString.split(/[\/-]/).map(Number),
    //     )
    //   : new Date();

    // if (isNaN(data.getTime()))
    //   throw new Error('Data inválida. Use "MM/AAAA" ou "MM-AAAA"');

    // const mes = data.toLocaleDateString('pt-BR', { month: 'long' });
    // return {
    //   mes: mes.charAt(0).toUpperCase() + mes.slice(1),
    //   ano: data.getFullYear().toString(),
    // };

    if(dataString){
        const [mesParam, anoParam] = dataString.split(/[\/-]/).map(Number)
        console.log(mesParam, anoParam)
        const dataPonto = new Date(anoParam, mesParam - 1, 1)

        const ano = dataPonto.getFullYear()
        const mes = dataPonto.toLocaleDateString('pt-BR', { month: 'long' });
        return {
            mes: mes.charAt(0).toUpperCase() + mes.slice(1),
            ano: ano.toString()
          };
    }else {
        const dataPonto = new Date()

        const ano = dataPonto.getFullYear()
        const mes = dataPonto.toLocaleDateString('pt-BR', { month: 'long' });
        return {
            mes: mes.charAt(0).toUpperCase() + mes.slice(1),
            ano: ano.toString()
          };
    }
  }

  gerarFolhaIndividual(data?: string){
    
    const res = this.getMesAno(data)
    return res
  }
}

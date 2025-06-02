import * as fs from "fs/promises";
import * as path from "path";
import * as handlebars from "handlebars";
import { CompiladorDto } from "./dto/compilador.dto";
import { geradorDeLinhas } from "./geradorDeLinhas";
import { injetarLinhasNoCompilador, injetarLinhasEmLista } from "./injetarLinhasNoCompilador";



const templatesServidorDir = path.join(process.cwd(),
    'src',
    'folha',
    'templates',
    'folha-servidor'
);

const templatesSetorDir = path.join(process.cwd(),
    'src',
    'folha',
    'templates',
    'folha-setor'
);

export async function compilarHTML(nomeTemplate: string, data: CompiladorDto) {
    const templatePath = path.join(templatesServidorDir, `${nomeTemplate}.html`);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const compiladorFinal = injetarLinhasNoCompilador(data);
    const template = handlebars.compile(templateContent);
    return template(compiladorFinal);
}

export async function gerarArquivoHTML(conteudo: string, nomeArquivo: string): Promise<void> {
    const caminhoHTML = path.join(templatesServidorDir, nomeArquivo);
    await fs.writeFile(caminhoHTML, conteudo);
}

export async function gerarListaHTMLCompilada(nomeTemplate: string, lista: any[]): Promise<string[]> {
    const templatePath = path.join(templatesSetorDir, nomeTemplate);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const compilarTemplate = handlebars.compile(templateContent);

    return lista.map(item => compilarTemplate(item));
}

export async function gerarHTMLSetor(nomeArquivo: string, listaHTML: any[]): Promise<void> {
    const folhas = listaHTML.join('\n')
    const templateSetorPath = path.join(templatesSetorDir, 'template.html');

    const createPagesSetorPath = path.join(
        templatesSetorDir,
        `${nomeArquivo}`,
    )

    const templateSetorContent = await fs.readFile(templateSetorPath, 'utf-8')
    const compilarTemplate = handlebars.compile(templateSetorContent);
    const folhasUnidasHTML = compilarTemplate({ folhas })
    await fs.writeFile(createPagesSetorPath, folhasUnidasHTML)
}
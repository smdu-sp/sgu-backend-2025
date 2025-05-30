import * as fs from "fs/promises";
import * as path from "path";
import * as handlebars from "handlebars";

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

export async function compilarHTML(nomeTemplate: string, data: any) {
    const templatePath = path.join(templatesServidorDir, `${nomeTemplate}.html`);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateContent);
    return template(data);
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
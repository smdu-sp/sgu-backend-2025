import * as fs from "fs/promises";
import * as path from "path";
import * as handlebars from "handlebars";

const templatesDir = path.join(
    process.cwd(),
    process.env.NODE_ENV === 'production'
        ? 'dist/src/folha/templates/folha-ponto'
        : 'src/folha/templates/folha-ponto'
);

export async function compilarHTML(nomeTemplate: string, data: any) {
    const templatepath = path.join(templatesDir, `${nomeTemplate}.html`);
    const templateContent = await fs.readFile(templatepath, 'utf-8');
    const template = handlebars.compile(templateContent);
    return template(data);
}

export async function gerarFolhaPonto(data: any): Promise<string> {
    return compilarHTML('template', data);
}

export async function gerarArquivoHTML(conteudo: string, nomeArquivo: string): Promise<void> {
    const caminhoTeste = path.join(templatesDir, nomeArquivo);
    await fs.writeFile(caminhoTeste, conteudo);
}
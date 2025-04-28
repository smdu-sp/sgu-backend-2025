import * as fs from "fs/promises";
import * as path from "path";
import * as handlebars from "handlebars";

// Definir o diretório de templates de forma mais robusta
const templatesDir = path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'production'
        ? 'dist/src/folha/templates/folha-ponto'
        : 'src/folha/templates/folha-ponto'
);

// Garantir que o diretório existe
async function garantirDiretorio(diretorio: string): Promise<void> {
    try {
        await fs.access(diretorio);
    } catch (error) {
        // Diretório não existe, vamos criá-lo
        await fs.mkdir(diretorio, { recursive: true });
        console.log(`Diretório criado: ${diretorio}`);
    }
}

export async function compilarHTML(nomeTemplate: string, data: any) {
    await garantirDiretorio(templatesDir);

    const templatePath = path.resolve(templatesDir, `${nomeTemplate}.html`);
    const cssPath = path.resolve(templatesDir, 'styles.css');

    try {
        console.log(`Lendo template: ${templatePath}`);
        const templateContent = await fs.readFile(templatePath, 'utf-8');

        // Verificar se o CSS existe e injetá-lo diretamente no HTML
        let cssContent = '';
        try {
            cssContent = await fs.readFile(cssPath, 'utf-8');
            console.log('CSS carregado com sucesso');
        } catch (cssError) {
            console.warn(`Aviso: Não foi possível carregar o CSS: ${cssError.message}`);
        }

        // Adicionar o CSS diretamente no HTML
        const templateWithCss = templateContent.replace(
            /<link rel="stylesheet".*?>/,
            `<style>${cssContent}</style>`
        );

        const template = handlebars.compile(templateWithCss);
        const compiledHtml = template(data);

        return compiledHtml;
    } catch (error) {
        console.error(`Erro ao compilar HTML: ${error.message}`);
        throw error;
    }
}

export async function gerarHTMLPonto(data: any): Promise<string> {
    return compilarHTML('template', data);
}

export async function gerarArquivoPonto(conteudo: string, nomeArquivo: string): Promise<void> {
    await garantirDiretorio(templatesDir);

    const caminhoArquivo = path.resolve(templatesDir, nomeArquivo);
    try {
        await fs.writeFile(caminhoArquivo, conteudo);
        console.log(`Arquivo HTML gerado com sucesso: ${caminhoArquivo}`);
    } catch (error) {
        console.error(`Erro ao gerar arquivo HTML: ${error.message}`);
        throw error;
    }
}
import { chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs/promises';

export async function gerarPDFFolhaViaHTML(nomeArquivoHtml: string) {
    try {
        const templatesDir = path.join(
            process.cwd(), 'src/folha/templates/folha-ponto'
        );

        const caminhoHTML = path.join(templatesDir, nomeArquivoHtml);

        await fs.access(caminhoHTML);

        const conteudoHTML = await fs.readFile(caminhoHTML, 'utf-8');

        const browser = await chromium.launch();
        const page = await browser.newPage();

        await page.setContent(conteudoHTML, { waitUntil: 'load' });

        const caminhoCSS = path.join(templatesDir, 'styles.css');
        await page.addStyleTag({ path: caminhoCSS });


        const nomeArquivoPDF = nomeArquivoHtml.replace('.html', '.pdf');
        const caminhoPDF = path.join(templatesDir, nomeArquivoPDF);

        await page.pdf({
            path: caminhoPDF,
            format: 'A4',
            printBackground: true,
        });

        await browser.close();
        return caminhoPDF;

    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        throw error;
    }
}

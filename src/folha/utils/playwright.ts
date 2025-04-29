import { chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs/promises';

export async function gerarPDFFolhaViaURL(nomeArquivoHtml: string) {
    const url = `http://127.0.0.1:5500/src/folha/templates/folha-ponto/${encodeURIComponent(nomeArquivoHtml)}`;
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle' });

    const nomeArquivoPDF = nomeArquivoHtml.replace('.html', '.pdf');
    const caminhoPDF = path.join(process.cwd(), 'src/folha/templates/folha-ponto', nomeArquivoPDF);

    await page.pdf({
        path: caminhoPDF,
        format: 'A4',
        printBackground: true,
    });

    await browser.close();
    return caminhoPDF;
}

export async function gerarPDFFolhaViaHTML(nomeArquivoHtml: string) {
    try {
        const templatesDir = path.join(
            process.cwd(), 'src/folha/templates/folha-ponto'
        );

        // console.log('templatesDir', templatesDir)

        const caminhoHTML = path.join(templatesDir, nomeArquivoHtml);

        // console.log('caminhoHTML', caminhoHTML)

        await fs.access(caminhoHTML);

        const conteudoHTML = await fs.readFile(caminhoHTML, 'utf-8');

        // console.log('conteudoHTML', conteudoHTML)

        const browser = await chromium.launch();
        const page = await browser.newPage();

        await page.setContent(conteudoHTML, { waitUntil: 'load' });

        const caminhoCSS = path.join(templatesDir, 'styles.css');
        await page.addStyleTag({ path: caminhoCSS });

        // console.log('caminhoCSS', caminhoCSS)

        const nomeArquivoPDF = nomeArquivoHtml.replace('.html', '.pdf');
        // console.log('nomeArquivoPDF', nomeArquivoPDF)
        const caminhoPDF = path.join(templatesDir, nomeArquivoPDF);
        // console.log('caminhoPDF', caminhoPDF)

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

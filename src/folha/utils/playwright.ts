import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

export async function playwright(htmlFilePath: string, outputPdfPath: string) {
    console.log('Iniciando geração de PDF...');
    console.log('Caminho do HTML:', htmlFilePath);
    console.log('Caminho do PDF:', outputPdfPath);

    // Verificar se o arquivo HTML existe
    if (!fs.existsSync(htmlFilePath)) {
        throw new Error(`Arquivo HTML não encontrado: ${htmlFilePath}`);
    }

    // Garantir que o diretório do PDF exista
    const pdfDir = path.dirname(outputPdfPath);
    if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
        console.log(`Diretório para PDF criado: ${pdfDir}`);
    }

    // Iniciar o navegador com opções específicas
    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const context = await browser.newContext();
        const page = await context.newPage();

        // Usar o protocolo file:// com o caminho absoluto
        const fileUrl = `file://${htmlFilePath}`;
        console.log('URL do arquivo:', fileUrl);

        await page.goto(fileUrl, {
            waitUntil: 'networkidle',
            timeout: 60000 // Aumentar o timeout para 60 segundos
        });

        // Aguardar para garantir que o CSS seja carregado
        await page.waitForTimeout(2000);

        // Verificar se há erros de carregamento
        const errors = await page.evaluate(() => {
            return {
                cssLoaded: document.styleSheets.length > 0,
                imagesLoaded: Array.from(document.images).every(img => img.complete)
            };
        });

        console.log('Status de carregamento:', errors);

        // Gerar o PDF
        await page.pdf({
            path: outputPdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        console.log(`PDF gerado com sucesso: ${outputPdfPath}`);
        return outputPdfPath;
    } catch (error) {
        console.error('Erro detalhado ao gerar PDF:', error);
        throw error;
    } finally {
        await browser.close();
        console.log('Navegador fechado');
    }
}
import { join } from "path"

class ParametrosDeStringDTO {
    caminhoHTML: string;
    nomeArquivoHTML: string;
    nomeArquivoPDF: string
    caminhoPDF?: string;
    pdfDir?: string;
}

export function gerarParametrosDeString(nomeArquivo: string, categoria: string): ParametrosDeStringDTO {
    const nomeArquivoHTML = `${nomeArquivo}_f-f-i.html`;
    const nomeArquivoPDF = nomeArquivoHTML.replace('.html', '.pdf');

    const caminhoBase = categoria === 'servidor'
        ? 'src/folha/templates/folha-servidor'
        : 'src/folha/templates/folha-setor';

    return {
        caminhoHTML: join(process.cwd(), caminhoBase, nomeArquivoHTML),
        caminhoPDF: join(process.cwd(), 'src', 'folha', 'pdfs', nomeArquivoPDF),
        nomeArquivoHTML,
        nomeArquivoPDF,
        pdfDir: join(process.cwd(), 'src', 'folha', 'pdfs'),
    };
}
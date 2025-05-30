export class FolhaIndividualDto {
    id: string;
    periodo?: string
}

export class FolhaPorSetorDto {
    codigoUnidade: string;
    periodo?: string
}

export class PdfResponseDto {
    pdfPath: string;
    nomeArquivoPDF: string
    htmlPath?: string
}

export type cleanArquivos = () => Promise<void>

export class PdfResponseCleanDto extends PdfResponseDto {
    cleanup?: cleanArquivos
}
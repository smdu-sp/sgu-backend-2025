export class FolhaIndividualDto {
    id: string;
    data?: string
}

export class FolhaPorSetorDto extends FolhaIndividualDto {
    codigoUnidade: string;
}
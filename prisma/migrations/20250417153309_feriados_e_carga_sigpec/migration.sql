-- DropIndex
DROP INDEX `cargas_sigpec_id_key` ON `cargas_sigpec`;

-- CreateTable
CREATE TABLE `feriados` (
    `id` VARCHAR(191) NOT NULL,
    `data` DATE NOT NULL,
    `tipo` ENUM('FERIADO_NACIONAL', 'FERIADO_ESTADUAL', 'FERIADO_MUNICIPAL', 'PONTO_FACULTATIVO') NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `feriados_data_key`(`data`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feriados_recorrentes` (
    `id` VARCHAR(191) NOT NULL,
    `dia` INTEGER NOT NULL,
    `mes` INTEGER NOT NULL,
    `tipo` ENUM('FERIADO_NACIONAL', 'FERIADO_ESTADUAL', 'FERIADO_MUNICIPAL', 'PONTO_FACULTATIVO') NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

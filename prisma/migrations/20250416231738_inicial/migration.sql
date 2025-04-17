/*
  Warnings:

  - The primary key for the `unidades` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `unidades` table. All the data in the column will be lost.
  - Added the required column `codigoUnidade` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `unidades` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`codigo`);

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `codigoUnidade` VARCHAR(191) NOT NULL,
    ADD COLUMN `estagiario` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `funcionarios` (
    `usuarioId` VARCHAR(191) NOT NULL,
    `rf` VARCHAR(191) NOT NULL,
    `vinculo` INTEGER NOT NULL,
    `nomeCargo` VARCHAR(191) NOT NULL,
    `refCargo` VARCHAR(191) NOT NULL,
    `observacao` VARCHAR(191) NULL,

    UNIQUE INDEX `funcionarios_usuarioId_key`(`usuarioId`),
    UNIQUE INDEX `funcionarios_rf_key`(`rf`),
    UNIQUE INDEX `funcionarios_vinculo_key`(`vinculo`),
    PRIMARY KEY (`usuarioId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cargas_sigpec` (
    `id` VARCHAR(191) NOT NULL,
    `rf` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NULL,
    `vinculo` VARCHAR(191) NULL,
    `especie` VARCHAR(191) NULL,
    `inicio` DATE NULL,
    `termino` DATE NULL,
    `cargo` VARCHAR(191) NULL,
    `nomeCargo` VARCHAR(191) NULL,
    `refCargo` VARCHAR(191) NULL,
    `unidade` VARCHAR(191) NULL,
    `nomeSetor` VARCHAR(191) NULL,
    `relJurAdm` VARCHAR(191) NULL,
    `tipoEvento` VARCHAR(191) NULL,
    `inicioExerc` DATE NULL,
    `titular` VARCHAR(191) NULL,
    `numVincTit` VARCHAR(191) NULL,
    `nomeFuncTit` VARCHAR(191) NULL,
    `inicioRem` DATE NULL,
    `fimRem` DATE NULL,
    `observacao` VARCHAR(191) NULL,
    `vaga` VARCHAR(191) NULL,
    `mes` INTEGER NOT NULL,
    `ano` INTEGER NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `cargas_sigpec_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `funcionarios` ADD CONSTRAINT `funcionarios_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

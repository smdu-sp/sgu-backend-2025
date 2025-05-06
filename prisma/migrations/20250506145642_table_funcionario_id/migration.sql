/*
  Warnings:

  - The primary key for the `funcionarios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `funcionarios` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `funcionarios` DROP PRIMARY KEY,
    ADD COLUMN `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `cargos` (
    `id` VARCHAR(191) NOT NULL,
    `nomeCargo` VARCHAR(191) NOT NULL,
    `refCargo` VARCHAR(191) NOT NULL,
    `observacao` VARCHAR(191) NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cargos` ADD CONSTRAINT `cargos_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `nomeCargo` on the `funcionarios` table. All the data in the column will be lost.
  - You are about to drop the column `refCargo` on the `funcionarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `funcionarios` DROP COLUMN `nomeCargo`,
    DROP COLUMN `refCargo`;

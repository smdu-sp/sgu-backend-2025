/*
  Warnings:

  - The primary key for the `funcionarios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `funcionarios` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `funcionarios_vinculo_key` ON `funcionarios`;

-- AlterTable
ALTER TABLE `funcionarios` DROP PRIMARY KEY,
    DROP COLUMN `id`;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_codigoUnidade_fkey` FOREIGN KEY (`codigoUnidade`) REFERENCES `unidades`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

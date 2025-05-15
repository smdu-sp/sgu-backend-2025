import { OnEvent } from "@nestjs/event-emitter";
import { Injectable } from "@nestjs/common";
import * as fs from 'fs/promises';

@Injectable()
export class CleanFolhas {
    @OnEvent('folha.gerada')
    async handleFolhaGerada(payload: { pdfPath: string, htmlPath: string }) {
        try {
            await fs.unlink(payload.pdfPath)
            await fs.unlink(payload.htmlPath)
        } catch (error) {
            console.error('erro ao apagar o arquivo', error)
        }
    }
}
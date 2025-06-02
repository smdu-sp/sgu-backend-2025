import { geradorDeLinhas } from "./geradorDeLinhas";
import { CompiladorDto } from "./dto/compilador.dto";

export function injetarLinhasNoCompilador(compilador: CompiladorDto) {
    const linhasHtml = geradorDeLinhas(compilador.linhas)

    return {
        ...compilador,
        linhas: linhasHtml
    };
}

export function injetarLinhasEmLista(compiladores: CompiladorDto[]) {
    return compiladores.map(injetarLinhasNoCompilador);
}
import * as Holidays from "date-holidays";

export function calcularDiasNaoUteis(periodo: string) {
    const feriados = new (Holidays as any)();

    feriados.init('BR', 'SP', 'sp');

    if (!periodo) {
        const dataAtual = new Date()
        const ano = (dataAtual.getFullYear()).toString();
        let mes = (dataAtual.getMonth() + 1).toString();
        periodo = `${mes}/${ano}`
    }

    const [mes, ano] = periodo.split(/[\/-]/).map(Number);
    const diasNaoUteis = [];
    const diasNoMes = new Date(ano, mes, 0).getDate();

    for (let dia = 1; dia <= diasNoMes; dia++) {
        const data = new Date(ano, mes - 1, dia);
        const diaSemana = data.getDay();

        if (diaSemana === 0 || diaSemana === 6) {
            diasNaoUteis.push(dia);
        }

        if (feriados.isHoliday(data)) {
            diasNaoUteis.push(dia);
        }
    }

    for (let i = 31; diasNoMes < i; i--) {
        diasNaoUteis.push(i)
    }
    return diasNaoUteis;
}


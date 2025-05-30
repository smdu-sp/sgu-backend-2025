
export function calcularDiasNaoUteis(periodo: string) {
    const [mes, ano] = periodo.split(/[\/-]/).map(Number);
    const diasNaoUteis = [];
    const diasNoMes = new Date(ano, mes, 0).getDate();

    for (let dia = 1; dia <= diasNoMes; dia++) {
        const data = new Date(ano, mes - 1, dia);
        const diaSemana = data.getDay();

        if (diaSemana === 0 || diaSemana === 6) {
            diasNaoUteis.push(dia);
        }
    }

    for (let i = 31; diasNoMes < i; i--) {
        diasNaoUteis.push(i)
    }

    return diasNaoUteis;
}


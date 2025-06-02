
export function geradorDeLinhas(lista: Number[]) {

    const linhas = []

    for (let i = 1; i <= 31; i++) {

        if (lista.includes(i)) {
            linhas.push(`
                 <tr class="day-table-weekend">
                    <td>${i}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                `)
        } else {
            linhas.push(`
                 <tr>
                    <td>${i}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                `)
        }
    }

    return linhas
}
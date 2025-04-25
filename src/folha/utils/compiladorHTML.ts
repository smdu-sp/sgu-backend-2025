import * as fs from "fs/promises";
import * as path from "path";
import * as handlebars from "handlebars";
// import * as helpers from "handlebars-helpers";

// helpers({ handlebars });

export class CompiladorHTML {
    constructor(
        private readonly templatesDir = path.join(__dirname, '../folha/templates/folha-ponto'),
    ){}

    async compilador(nomeTemplate: string, data: any){
        const templatepath = path.join(this.templatesDir, `${nomeTemplate}.html`)
        const templateContent = await fs.readFile(templatepath, 'utf-8');
        const template = handlebars.compile(templateContent);
        return template(data);
    }

    async generaFolhaPonto(data: any): Promise<string> {
        return this.compilador('template', data);
      }
}

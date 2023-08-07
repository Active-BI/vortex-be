const XLSX = require('xlsx');
export const templates_xlsx = {
  RH_FUNCIONARIOS: {
    nomeEmpresa: 'String',
    matricula: 'String',
    nome: 'String',
    cargos: 'String',
    dataAdmissao: 'data: 29/10/2022',
    area: 'String',
    salario: 'String',
    sexo: 'Masculino ou Feminino',
    cutis: 'Negro, Branco, Amarelo ou Pardo',
    dataNascimento: 'data: 29/10/2022',
    email: 'exemplo@exemplo.com',
    vinculoEmpregaticio: 'CLT, PJ ou Prazo Determinado (Lei 9.601)',
    situacaoEmpregado: 'Ativo ou Demitido',
    grauInstrucao: 'String',
    pcd: 'VERDADEIRO ou FALSO',
    desligado: 'VERDADEIRO ou FALSO',
    dataDesligamento: 'data: 29/10/2022',
    motivoDesligamento: 'String',
  },
};
export function toCamelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}
export function RHTemplate(type) {
  const sheetData = Object.keys(templates_xlsx[type.toUpperCase()]);

  // Criando o workbook e worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([sheetData]);

  // Adicionando o worksheet ao workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'base');

  const worksheetExample = XLSX.utils.aoa_to_sheet([sheetData]);
  const rowData = Object.values(templates_xlsx[type.toUpperCase()]);
  XLSX.utils.sheet_add_aoa(worksheetExample, [sheetData, rowData]);

  // Adicionando a segunda aba ao workbook
  XLSX.utils.book_append_sheet(workbook, worksheetExample, 'base 2');

  const buffer = XLSX.write(workbook, { type: 'buffer' });
  return buffer;
}

export function generateBuffer(headers, data) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'base');
  const buffer = XLSX.write(workbook, { type: 'buffer' });
  return buffer;
}

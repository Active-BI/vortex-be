const XLSX = require('xlsx');
export const templates_xlsx = {
  FUNCIONARIOS: {
    nomeEmpresa: 'alfanumérico',
    matricula: 'alfanumérico',
    nome: 'alfanumérico',
    cargos: 'alfanumérico',
    dataAdmissao: 'MM/DD/YYYY',
    area: 'alfanumérico',
    salario: 'Inteiro ou decimal',
    sexo: 'Masculino, Feminino ou Outros',
    cutis: 'Negro, Branco ou Pardo',
    dataNascimento: 'MM/DD/YYYY',
    email: 'exemplo@exemplo.com',
    vinculoEmpregaticio: 'CLT, PJ, Freelancer ou Prazo Determinado (Lei 9.601)',
    situacaoEmpregado: 'Ativo ou Demitido',
    grauInstrucao: 'alfanumérico',
    pcd: 'VERDADEIRO ou FALSO',
    desligado: 'VERDADEIRO ou FALSO',
    dataDesligamento: 'MM/DD/YYYY',
    motivoDesligamento: 'alfanumérico',
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
  XLSX.utils.book_append_sheet(workbook, worksheetExample, 'base exemplo');

  const buffer = XLSX.write(workbook, { type: 'buffer' });
  return buffer;
}

export function generateBuffer(content: {sheet, header, data}[]) {
  const workbook = XLSX.utils.book_new();
  content.forEach(element => {
    const worksheet = XLSX.utils.aoa_to_sheet([element.header, ...element.data]);
    XLSX.utils.book_append_sheet(workbook, worksheet, element.sheet);
  });
  const buffer = XLSX.write(workbook, { type: 'buffer' });
  return buffer;
}

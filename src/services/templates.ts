const XLSX = require('xlsx');
export const templates_xlsx = {
  RH_FUNCIONARIOS: {
    'Nome Empresa': 'nomeEmpresa',
    Matrícula: 'matricula',
    Nome: 'nome',
    Cargos: 'cargos',
    'Data da Admissão': 'dataAdmissao',
    Área: 'area',
    Salário: 'salario',
    Sexo: 'sexo',
    Cútis: 'cutis',
    'Data de Nascimento': 'dataNascimento',
    'E-Mail': 'email',
    'Vínculo Empregatício': 'vinculoEmpregaticio',
    'Situação do Empregado': 'situacaoEmpregado',
    'Grau de Instrução': 'grauInstrucao',
    PCD: 'pcd',
    Desligado: 'desligado',
    'Data de Desligamento': 'dataDesligamento',
    'Motivo do Desligamento': 'motivoDesligamento',
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
  const sheetData = Object.keys(templates_xlsx[type]);

  // Criando o workbook e worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([sheetData]);

  // Adicionando o worksheet ao workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'base');

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

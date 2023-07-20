const XLSX = require('xlsx');
export const templates_xlsx = {
  RH_FUNCIONARIOS: [
    'Nome Empresa',
    'Matrícula',
    'Nome',
    'Cargos',
    'Data da Admissão',
    'Área',
    'Salário',
    'Sexo',
    'Cútis',
    'Data de Nascimento',
    'E-Mail',
    'Vínculo Empregatício',
    'Situação do Empregado',
    'Grau de Instrução',
    'PCD',
    'Desligado',
    'Data de Desligamento',
    'Motivo do Desligamento',
  ],
};

export function RHTemplate(type) {
  const sheetData = templates_xlsx[type];

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

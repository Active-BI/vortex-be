import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export const roles = [
  {
    name: 'User',
    id: 'ca21241b-a37d-4e6f-bbb6-26643d3cdd99',
  },
  {
    name: 'Admin',
    id: '6a203390-8389-49ca-aa0e-6a14ba7815bc',
  },
  {
    name: 'Master',
    id: '41dd767c-45d6-437d-9ccb-9a4987e07505',
  },
];
const tenantIds = [
  'd6c5a0ad-9723-421d-ba63-897aa9f59c19',
  'fe4cec7c-d476-4389-9c57-4be40ada2016',
];
const totalRows = 250;
const data = [];
// Gerar e inserir 100 registros com o tenant_id fornecido
const userRequests = [];

for (let i = 0; i < 5; i++) {
  userRequests.push({
    id: uuidv4(),
    createdAt: faker.date.past(),
    company_description: faker.company.name(),
    company_name: faker.company.name(),
    company_cnpj: '000000000000' + i,
    email: faker.internet.email(),
    name: faker.person.fullName(),
    description: faker.lorem.paragraph(1),
    profession: faker.person.jobTitle(),
    blocked: false,
    accept: false,
  });
}

for (let i = 0; i < totalRows; i++) {
  let desligado = faker.datatype.boolean();
  data.push({
    tenant_id: faker.helpers.arrayElement(tenantIds),
    nomeEmpresa: faker.company.name(),
    matricula: randomUUID(),
    nome: faker.person.fullName(),
    cargos: faker.person.jobTitle(),
    dataAdmissao: faker.date.past(),
    area: faker.commerce.department(),
    salario: parseFloat(faker.finance.amount(2000, 10000, 2)),
    sexo: faker.helpers.arrayElement(['Masculino', 'Feminino']),
    cutis: faker.helpers.arrayElement(['Branco', 'Negro', 'Pardo', 'Amarelo']),
    dataNascimento: faker.date.between({
      from: '1950-01-01',
      to: '2000-12-31',
    }),
    email: faker.internet.email(),
    vinculoEmpregaticio: faker.helpers.arrayElement(['CLT', 'PJ']),
    situacaoEmpregado: faker.helpers.arrayElement(['Ativo', 'Inativo']),
    grauInstrucao: faker.helpers.arrayElement(['Ensino Médio', 'Superior']),
    pcd: faker.datatype.boolean(),
    desligado: desligado,
    dataDesligamento: desligado ? faker.date.past() : null,
    motivoDesligamento: desligado ? faker.lorem.paragraph(2) : null,
  });
}

export const EmployeeSeed = async (prisma: PrismaClient) => {
  await prisma.rh_funcionarios_table.deleteMany();
  await prisma.user_Tenant_DashBoard.deleteMany();
  await prisma.tenant_DashBoard.deleteMany();
  await prisma.dashBoard.deleteMany();
  await prisma.user_Auth.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.rls.deleteMany();
  await prisma.request_admin_access.deleteMany();

  const setup = async () => {
    await prisma.rls.createMany({
      data: roles,
    });
  };
  await setup().then(async () => {
    await prisma.tenant.createMany({
      data: [
        {
          id: 'd6c5a0ad-9723-421d-ba63-897aa9f59c19',
          tenant_name: 'Tenant 1',
          active: true,
        },
        {
          id: 'fe4cec7c-d476-4389-9c57-4be40ada2016',
          tenant_name: 'Tenant 2',
          active: true,
        },
      ],
    });

    await prisma.user.createMany({
      data: [
        {
          id: '93d9b34b-1a00-4a83-b935-63a69f16ecf4',
          contact_email: 'teste@t1master.com.br',
          name: 'teste master',
          born_date: new Date(),
          description: 'description master',
          personal_email: 'teste@t1master.com.br',
          profession: 'master',
          rls_id: '41dd767c-45d6-437d-9ccb-9a4987e07505',
        },
        {
          id: 'ffe81a3c-6d52-4cf3-bbc1-b655b7281a1b',
          contact_email: 'teste@t1user.com.br',
          name: 'teste user',
          born_date: new Date(),
          description: 'description user',
          personal_email: 'teste@t1user.com.br',
          profession: 'user',
          tenant_id: 'd6c5a0ad-9723-421d-ba63-897aa9f59c19',
          rls_id: 'ca21241b-a37d-4e6f-bbb6-26643d3cdd99',
        },
        {
          id: 'a0d8b88b-97b5-40b8-a790-3d3dac9b13be',
          contact_email: 'admin@t1admin.com.br',
          name: 'teste admin',
          born_date: new Date(),
          description: 'description admin',
          personal_email: 'teste@t1admin.com.br',
          profession: 'profession admin',
          tenant_id: 'd6c5a0ad-9723-421d-ba63-897aa9f59c19',
          rls_id: '6a203390-8389-49ca-aa0e-6a14ba7815bc',
        },
        {
          id: '93c408f1-b527-4098-937a-cade4de4ae5d',
          contact_email: 'teste@t2user.com.br',
          name: 'teste user 2',
          born_date: new Date(),
          description: 'description user',
          personal_email: 'teste@t2user.com.br',
          profession: 'user',
          tenant_id: 'fe4cec7c-d476-4389-9c57-4be40ada2016',
          rls_id: 'ca21241b-a37d-4e6f-bbb6-26643d3cdd99',
        },
        {
          id: '16ea8f63-c5de-4c87-94bc-7140493eaab2',
          contact_email: 'admin@t2admin.com.br',
          name: 'teste admin 2',
          born_date: new Date(),
          description: 'description admin',
          personal_email: 'teste@t2admin.com.br',
          profession: 'profession admin',
          tenant_id: 'fe4cec7c-d476-4389-9c57-4be40ada2016',
          rls_id: '6a203390-8389-49ca-aa0e-6a14ba7815bc',
        },
      ],
    });
    await prisma.user_Auth.createMany({
      data: [
        {
          id: '5c0ab3de-2214-4f49-bbee-a9e8ad3ef6a3',
          normalized_contact_email: 'TESTE@T1MASTER.COM.BR',
          last_access: null,
          reset_pass: null,
          secret: null,
          anchor: false,
          password_hash:
            '$2b$10$LKl2Tqnm9c8Lh/qkAESd1.H2.UdmmKUryng1Xd0zvbRq3PGxMGTRG',
          user_id: '93d9b34b-1a00-4a83-b935-63a69f16ecf4',
        },
        {
          id: '6ea9ee12-2651-415e-860b-032b5febaaeb',
          normalized_contact_email: 'TESTE@T1USER.COM.BR',
          last_access: null,
          reset_pass: null,
          anchor: false,
          secret: null,
          password_hash:
            '$2b$10$LKl2Tqnm9c8Lh/qkAESd1.H2.UdmmKUryng1Xd0zvbRq3PGxMGTRG',
          user_id: 'ffe81a3c-6d52-4cf3-bbc1-b655b7281a1b',
        },
        {
          id: 'c08f9907-9121-4e0e-8d1b-60761701b2ae',
          normalized_contact_email: 'TESTE@T1ADMIN.COM.BR',
          last_access: null,
          anchor: true,
          reset_pass: null,
          secret: null,
          password_hash:
            '$2b$10$LKl2Tqnm9c8Lh/qkAESd1.H2.UdmmKUryng1Xd0zvbRq3PGxMGTRG',
          user_id: 'a0d8b88b-97b5-40b8-a790-3d3dac9b13be',
        },
        {
          id: '95a98bee-77f8-492e-afc8-4dcd6d942eef',
          normalized_contact_email: 'TESTE@T2USER.COM.BR',
          last_access: null,
          reset_pass: null,
          anchor: false,
          secret: null,
          password_hash:
            '$2b$10$LKl2Tqnm9c8Lh/qkAESd1.H2.UdmmKUryng1Xd0zvbRq3PGxMGTRG',
          user_id: '93c408f1-b527-4098-937a-cade4de4ae5d',
        },
        {
          id: '61ce6458-f960-4da4-80d0-a612641f4eca',
          normalized_contact_email: 'TESTE@T2ADMIN.COM.BR',
          last_access: null,
          reset_pass: null,
          secret: null,
          anchor: true,
          password_hash:
            '$2b$10$LKl2Tqnm9c8Lh/qkAESd1.H2.UdmmKUryng1Xd0zvbRq3PGxMGTRG',
          user_id: '16ea8f63-c5de-4c87-94bc-7140493eaab2',
        },
      ],
    });
    const arrayDeReports = [
      {
        type: 'RH_FUNCIONARIOS',
        report_id: '7b71c89f-1d23-4d57-a99c-369f0ae8b5d1',
        group_id: 'c807ca26-3f93-463d-aa15-9a12e48174ba',
        name: 'Funcionários',
      },
      {
        type: 'USUARIOS',
        report_id: 'a4980e1a-6cf3-460f-9e25-a206bca62c79',
        group_id: '',
        name: 'Usuários',
      },
    ];
    await prisma.dashBoard.createMany({
      data: arrayDeReports,
    });

    await prisma.tenant_DashBoard.createMany({
      data: [
        {
          id: '5c96a436-c455-49e1-a12d-42bf5e86edf6',
          dashboard_id: '7b71c89f-1d23-4d57-a99c-369f0ae8b5d1',
          tenant_id: 'd6c5a0ad-9723-421d-ba63-897aa9f59c19',
        },

        {
          id: '891e9633-6e1c-47ab-abdc-f736cce00347',
          dashboard_id: 'a4980e1a-6cf3-460f-9e25-a206bca62c79',
          tenant_id: 'd6c5a0ad-9723-421d-ba63-897aa9f59c19',
        },

        {
          id: 'a9f3c05a-33c7-48b0-bd5a-1caff7b83d83',
          dashboard_id: 'a4980e1a-6cf3-460f-9e25-a206bca62c79',
          tenant_id: 'fe4cec7c-d476-4389-9c57-4be40ada2016',
        },
      ],
    });
    await prisma.user_Tenant_DashBoard.createMany({
      data: [
        {
          tenant_DashBoard_id: '5c96a436-c455-49e1-a12d-42bf5e86edf6',
          user_id: 'a0d8b88b-97b5-40b8-a790-3d3dac9b13be',
        },

        {
          tenant_DashBoard_id: '891e9633-6e1c-47ab-abdc-f736cce00347',
          user_id: 'a0d8b88b-97b5-40b8-a790-3d3dac9b13be',
        },
        {
          tenant_DashBoard_id: '5c96a436-c455-49e1-a12d-42bf5e86edf6',
          user_id: '16ea8f63-c5de-4c87-94bc-7140493eaab2',
        },

        {
          tenant_DashBoard_id: 'a9f3c05a-33c7-48b0-bd5a-1caff7b83d83',
          user_id: '16ea8f63-c5de-4c87-94bc-7140493eaab2',
        },
      ],
    });
    await prisma.request_admin_access.createMany({
      data: userRequests,
    });
    await prisma.rh_funcionarios_table.createMany({
      data,
    });
  });
};

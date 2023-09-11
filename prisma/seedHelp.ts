import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { insertRoutes } from './tabelas';

const ROLES = {
  User: 'ca21241b-a37d-4e6f-bbb6-26643d3cdd99',
  Admin: '6a203390-8389-49ca-aa0e-6a14ba7815bc',
  Master: '41dd767c-45d6-437d-9ccb-9a4987e07505',
};
export const roles = [
  {
    name: 'User',
    id: ROLES.User,
  },
  {
    name: 'Admin',
    id: ROLES.Admin,
  },
  {
    name: 'Master',
    id: ROLES.Master,
  },
];
const TENANTS = {
  TENANT1: 'd6c5a0ad-9723-421d-ba63-897aa9f59c19',
  MASTER: '3a4dc251-deea-4d2b-b6fb-8a067944b94e',
};
const tenantIds = [TENANTS.MASTER];
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
    nomeEmpresa: faker.helpers.arrayElement(['Active BI', 'Outra Empresa']),
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
    vinculoEmpregaticio: faker.helpers.arrayElement([
      'CLT',
      'PJ',
      'Freelance',
      'Prazo Determinado (Lei 9.601)',
    ]),
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
  await prisma.page_Role.deleteMany();
  await prisma.user_Page.deleteMany();
  await prisma.tenant_Page.deleteMany();
  await prisma.page_Group.deleteMany();
  await prisma.page.deleteMany();
  await prisma.user_Auth.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.rls.deleteMany();
  await prisma.request_admin_access.deleteMany();

  const setup = async () => {
    await prisma.rls.createMany({
      data: roles,
    });
    await prisma.tenant.createMany({
      data: [
        {
          id: 'd6c5a0ad-9723-421d-ba63-897aa9f59c19',
          tenant_name: 'Tenant 1',
          tenant_cnpj: '000000000000-11',
          active: true,
          restrict: false,
        },
        {
          id: '3a4dc251-deea-4d2b-b6fb-8a067944b94e',
          tenant_name: 'Master',
          tenant_cnpj: '000000000-00000',
          restrict: true,
          active: true,
        },
      ],
    });
  };
  await setup()
    .then(async () => {
      await insertRoutes(prisma);
    })
    .then(async () => {
      const userAdmin = '18da15ab-ae39-4b1c-98e9-0e0859556396';
      await prisma.user.createMany({
        data: [
          {
            id: '93d9b34b-1a00-4a83-b935-63a69f16ecf4',
            contact_email: 'teste@master.com.br',
            name: 'teste master',
            born_date: new Date(),
            description: 'description master',
            personal_email: 'teste@master.com.br',
            profession: 'master',
            tenant_id: TENANTS.MASTER,
            rls_id: '41dd767c-45d6-437d-9ccb-9a4987e07505',
          },
          {
            id: userAdmin,
            contact_email: 'gustavo.tahara@activebi.com.br',
            name: 'gustavo',
            born_date: new Date(),
            description: 'description master',
            personal_email: 'gustavo.tahara@activebi.com.br',
            profession: 'master',
            tenant_id: TENANTS.TENANT1,
            rls_id: '6a203390-8389-49ca-aa0e-6a14ba7815bc',
          },
          {
            id: '105d8682-383e-45ce-bdb3-6ca4a7257534',
            contact_email: 'lucas.franca@activebi.com.br',
            name: 'lucas',
            born_date: new Date(),
            description: 'description master',
            personal_email: 'lucas.franca@activebi.com.br',
            profession: 'admin',
            tenant_id: TENANTS.TENANT1,
            rls_id: '6a203390-8389-49ca-aa0e-6a14ba7815bc',
          },
        ],
      });
      await prisma.user_Auth.createMany({
        data: [
          {
            id: '5c0ab3de-2214-4f49-bbee-a9e8ad3ef6a3',
            normalized_contact_email: 'TESTE@MASTER.COM.BR',
            last_access: null,
            reset_pass: null,
            secret: null,
            anchor: false,
            password_hash:
              '$2b$10$LKl2Tqnm9c8Lh/qkAESd1.H2.UdmmKUryng1Xd0zvbRq3PGxMGTRG',
            user_id: '93d9b34b-1a00-4a83-b935-63a69f16ecf4',
          },
          {
            id: 'd420b02b-ffcc-43fb-8959-306f067a547e',
            normalized_contact_email: 'GUSTAVO.TAHARA@ACTIVEBI.COM.BR',
            last_access: null,
            anchor: true,
            reset_pass: null,
            secret: null,
            password_hash:
              '$2b$10$LKl2Tqnm9c8Lh/qkAESd1.H2.UdmmKUryng1Xd0zvbRq3PGxMGTRG',
            user_id: userAdmin,
          },
          {
            id: '0d336f62-6e97-43d2-84e2-d280db3c47d2',
            normalized_contact_email: 'LUCAS.FRANCA@ACTIVEBI.COM.BR',
            last_access: null,
            anchor: true,
            reset_pass: null,
            secret: null,
            password_hash:
              '$2b$10$LKl2Tqnm9c8Lh/qkAESd1.H2.UdmmKUryng1Xd0zvbRq3PGxMGTRG',
            user_id: '105d8682-383e-45ce-bdb3-6ca4a7257534',
          },
        ],
      });

      const screenTypes = {
        DASHBOARD: 'dashboard',
        REPORT: 'report',
        REPORT_UPLOAD: 'report-upload',
        DASBOARD_UPLOAD: 'dashboard-upload',
        PAGE: 'page',
      };

      await prisma.page_Group.createMany({
        data: [
          {
            id: '9b0e8176-5c8d-4024-ac28-524ba48d16c9',
            title: 'RH',
            formated_title: 'rh',
            icon: 'mat_outline:people_alt',
          },
          {
            id: 'bf296f83-5997-4349-97d6-12df34fd4da6',
            title: 'Administrador',
            formated_title: 'administrador',
            icon: 'mat_outline:settings',
          },
          {
            id: '3457d477-62c8-4596-8e30-71f9095064e2',
            title: 'Gestão Master',
            formated_title: 'administrador',

            restrict: true,
            icon: 'mat_outline:settings',
          },
          {
            id: '219abfe8-7478-4db3-9fb3-cf1d38fcace2',
            title: 'Gestão de telas',
            formated_title: 'gestao-de-telas',
            restrict: true,
            icon: 'widgets',
          },
        ],
      });

      await prisma.page.createMany({
        data: [
          {
            id: '9a7dc980-cc5f-4060-a111-e006d62e5f18',
            title: 'Funcionários',
            formated_title: 'funcionarios',
            link: 'view-report/rh/funcionarios',
            type: 'basic',
            report_type: screenTypes.REPORT_UPLOAD,
            report_id: '8dd5b75b-03f5-41ab-8d6c-6a69c8934d88',
            group_id: 'c807ca26-3f93-463d-aa15-9a12e48174ba',
            restrict: false,
            table_name: 'rh_funcionarios',
            page_group_id: '9b0e8176-5c8d-4024-ac28-524ba48d16c9',
          },
          {
            id: '4f59592f-88b9-4c7e-8478-c1a776e257f0',
            type: 'basic',
            report_type: screenTypes.PAGE,
            title: 'Usuários',
            formated_title: 'usuarios',
            restrict: false,
            link: 'administrador/usuarios',
            page_group_id: 'bf296f83-5997-4349-97d6-12df34fd4da6',
          },
          {
            id: '744b86c7-e6ac-43cf-ad65-1106081d1507',
            type: 'basic',
            report_type: screenTypes.PAGE,
            restrict: true,
            title: 'Ambientes',
            link: '/master/gestao/tenants',
            page_group_id: '3457d477-62c8-4596-8e30-71f9095064e2',
          },
          {
            id: '4351cd1c-ff08-4025-b862-5fa9c5938330',
            type: 'basic',
            report_type: screenTypes.PAGE,
            restrict: true,
            title: 'Solicitações De Cadastro',
            link: '/master/gestao/solicitacoes-de-cadastro',
            page_group_id: '3457d477-62c8-4596-8e30-71f9095064e2',
          },
          {
            id: '605a6c99-4e8c-4da5-9b5f-ccb61b42c5e4',
            restrict: true,
            type: 'basic',
            report_type: screenTypes.PAGE,
            title: 'Telas Da Aplicação',
            link: '/master/gestao/telas',
            page_group_id: '219abfe8-7478-4db3-9fb3-cf1d38fcace2',
          },
        ],
      });
      await prisma.tenant_Page.createMany({
        data: [
          {
            id: '679ea9b2-735a-49c1-be40-388077ffd603',
            page_id: '605a6c99-4e8c-4da5-9b5f-ccb61b42c5e4',
            tenant_id: TENANTS.MASTER,
          },
          {
            id: '00c1c01d-2076-4d25-b132-1285d9318bbd',
            page_id: '744b86c7-e6ac-43cf-ad65-1106081d1507',
            tenant_id: TENANTS.MASTER,
          },
          {
            id: '7b344198-02e8-411b-b801-f6641d1395d1',
            page_id: '4351cd1c-ff08-4025-b862-5fa9c5938330',
            tenant_id: TENANTS.MASTER,
          },
          {
            id: '5c96a436-c455-49e1-a12d-42bf5e86edf6',
            page_id: '9a7dc980-cc5f-4060-a111-e006d62e5f18',
            tenant_id: TENANTS.TENANT1,
          },
          {
            id: '891e9633-6e1c-47ab-abdc-f736cce00347',
            page_id: '4f59592f-88b9-4c7e-8478-c1a776e257f0',
            tenant_id: TENANTS.TENANT1,
          },
        ],
      });
      await prisma.page_Role.createMany({
        data: [
          {
            page_id: '605a6c99-4e8c-4da5-9b5f-ccb61b42c5e4',
            rls_id: ROLES.Master,
          },
          {
            page_id: '9a7dc980-cc5f-4060-a111-e006d62e5f18',
            rls_id: ROLES.Admin,
          },
          {
            page_id: '9a7dc980-cc5f-4060-a111-e006d62e5f18',
            rls_id: ROLES.User,
          },
          {
            page_id: '4f59592f-88b9-4c7e-8478-c1a776e257f0',
            rls_id: ROLES.Admin,
          },
          {
            page_id: '4351cd1c-ff08-4025-b862-5fa9c5938330',
            rls_id: ROLES.Master,
          },
          {
            page_id: '744b86c7-e6ac-43cf-ad65-1106081d1507',
            rls_id: ROLES.Master,
          },
        ],
      });
      await prisma.user_Page.createMany({
        data: [
          {
            tenant_page_id: '679ea9b2-735a-49c1-be40-388077ffd603',
            user_id: '93d9b34b-1a00-4a83-b935-63a69f16ecf4',
          },
          {
            tenant_page_id: '00c1c01d-2076-4d25-b132-1285d9318bbd',
            user_id: '93d9b34b-1a00-4a83-b935-63a69f16ecf4',
          },
          {
            tenant_page_id: '7b344198-02e8-411b-b801-f6641d1395d1',
            user_id: '93d9b34b-1a00-4a83-b935-63a69f16ecf4',
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

import { PrismaClient } from '@prisma/client';

export const EmployeeSeed = async (prisma: PrismaClient) => {
  await prisma.user_Auth.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.rls.deleteMany();
  await prisma.dashBoard.deleteMany();
  await prisma.user_DashBoard.deleteMany();
  await prisma.tenant_DashBoard.deleteMany();

  const setup = async () => {
    await prisma.rls.createMany({
      data: [
        {
          name: 'User',
          id: 'ca21241b-a37d-4e6f-bbb6-26643d3cdd99',
        },
        {
          name: 'Admin',
          id: '6a203390-8389-49ca-aa0e-6a14ba7815bc',
        },
      ],
    });
  };
  await setup().then(async () => {
    await prisma.tenant.createMany({
      data: [
        {
          id: 'd6c5a0ad-9723-421d-ba63-897aa9f59c19',
          tenant_name: 'Tenant 1',
        },
        {
          id: 'fe4cec7c-d476-4389-9c57-4be40ada2016',
          tenant_name: 'Tenant 2',
        },
      ],
    });

    await prisma.user.createMany({
      data: [
        {
          id: 'ffe81a3c-6d52-4cf3-bbc1-b655b7281a1b',
          contact_email: 'teste@testeuser.com.br',
          name: 'teste user',
          born_date: new Date(),
          description: 'description user',
          personal_email: 'teste@testeuser.com.br',
          profession: 'user',
          tenant_id: 'd6c5a0ad-9723-421d-ba63-897aa9f59c19',
          rls_id: 'ca21241b-a37d-4e6f-bbb6-26643d3cdd99',
        },
      ],
    });
    await prisma.user_Auth.createMany({
      data: [
        {
          id: '6ea9ee12-2651-415e-860b-032b5febaaeb',
          normalized_personal_email: 'TESTE@TESTEUSER.COM.BR',
          last_access: null,
          reset_pass: null,
          secret: null,
          password_hash:
            '$2b$10$LKl2Tqnm9c8Lh/qkAESd1.H2.UdmmKUryng1Xd0zvbRq3PGxMGTRG',
          user_id: 'ffe81a3c-6d52-4cf3-bbc1-b655b7281a1b',
        },
      ],
    });
  });
};

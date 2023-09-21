import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const routes = [
  {
    data: { roles: ['User', 'Admin'] },
    id: 'indicadores-segurança',
    title: 'Indicadores de Segurança',
    type: 'collapsable',
    icon: 'heroicons_outline:shield-check',
    children: [
      {
        data: { roles: ['User', 'Admin'] },
        id: 'gestao-vuln',
        title: 'Gestão de vulnerabilidades',
        type: 'basic',
        restrict: false,
        link: 'view-report/7b71c89f-1d23-4d57-a99c-369f0ae8b5d1/c807ca26-3f93-463d-aa15-9a12e48174ba',
      },
      {
        data: { roles: ['User', 'Admin'] },
        id: 'correlacionamento-log',
        title: 'Correlacionamento de Logs',
        restrict: false,
        type: 'basic',
        link: 'view-report/b715e54d-1715-425e-9cb3-5d0fb1b0447d/c807ca26-3f93-463d-aa15-9a12e48174ba',
      },
      {
        data: { roles: ['User', 'Admin'] },
        id: 'resp-incidentes',
        title: 'Resposta as Incidentes',
        restrict: false,
        type: 'basic',
        link: 'view-report/4ea21399-b6f6-467e-a769-935b02bcd61a/c807ca26-3f93-463d-aa15-9a12e48174ba',
      },
      {
        data: { roles: ['User', 'Admin'] },
        id: 'op-reqs',
        title: 'Operações e requisições',
        restrict: false,
        type: 'basic',
        link: 'view-report/1a7880e4-61e8-4c88-a13c-35f917323f69/c807ca26-3f93-463d-aa15-9a12e48174ba',
      },
      {
        data: { roles: ['User', 'Admin'] },
        id: 'map-dados',
        title: 'Mapeamento de dados',
        restrict: false,
        type: 'basic',
        link: 'view-report/79013f39-27af-4139-a2c2-b72c3bcfa0e7/c807ca26-3f93-463d-aa15-9a12e48174ba',
      },
      {
        data: { roles: ['User', 'Admin'] },
        id: 'cons-cookie',
        title: 'Gestão de Consentimento de Cookies',
        restrict: false,
        type: 'basic',
        link: 'view-report/15d9dd35-357b-4c7d-acbd-1544ecfac4dd/c807ca26-3f93-463d-aa15-9a12e48174ba',
      },
      {
        data: { roles: ['User', 'Admin'] },
        id: 'prev-vaz-dados',
        title: 'Prevenção Contra Vazamento de Dados',
        restrict: false,
        type: 'basic',
        link: 'view-report/bb27db32-2beb-4a64-9271-02ffdfc3bce9/c807ca26-3f93-463d-aa15-9a12e48174ba',
      },
      {
        data: { roles: ['User', 'Admin'] },
        id: 'dist-app-web',
        title: 'Distribuição de Aplicações Web',
        restrict: false,
        type: 'basic',
        link: 'view-report/a18b4f89-0169-408a-bdd0-766291f45cf5/c807ca26-3f93-463d-aa15-9a12e48174ba',
      },
    ],
  },

  {
    id: 'financeiro',
    title: 'Financeiro',
    type: 'collapsable',
    icon: 'mat_solid:attach_money',
    link: 'financeiro',
    data: { roles: ['Admin', 'User'] },
    children: [
      {
        data: { roles: ['User', 'Admin'] },
        id: 'P&L',
        title: 'P&L',
        restrict: false,
        type: 'basic',
        link: 'view-report/484c168a-0d65-42ed-9311-0d3eb0355996/8336cfba-32f1-40fc-a957-08c6b2f2a43f',
      },
      {
        data: { roles: ['User', 'Admin'] },
        id: 'P&L2',
        title: 'P&L 2',
        restrict: false,
        type: 'basic',
        link: 'view-report/ef31a339-7047-4630-90a4-3ed13e35a8da/63720031-826d-4f35-b533-e13be36e152c',
      },
      {
        data: { roles: ['User', 'Admin'] },
        id: 'AtualxOutlook',
        title: 'Atual x Outlook',
        restrict: false,
        type: 'basic',
        link: 'view-report/c8b6e6fe-8904-42cb-a597-b4c6943f7ae7/8336cfba-32f1-40fc-a957-08c6b2f2a43f',
      },
      {
        data: { roles: ['User', 'Admin'] },
        id: 'ProdutosGEO',
        title: 'Produtos GEO',
        restrict: false,
        type: 'basic',
        link: 'view-report/fa5460f3-837f-4807-a7ea-2d27fe96d2a0/8336cfba-32f1-40fc-a957-08c6b2f2a43f',
      },
      {
        data: { roles: ['User', 'Admin'] },
        id: 'RealxOrçado',
        title: 'Real x Orçado',
        restrict: false,
        type: 'basic',
        link: 'view-report/d83edbb7-6994-4ea6-84bb-397f676ddd94/63720031-826d-4f35-b533-e13be36e152c',
      },
      {
        data: { roles: ['User', 'Admin'] },
        id: 'Vendas',
        title: 'Vendas',
        restrict: false,
        type: 'basic',
        link: 'view-report/f7004150-ed6e-4e9c-854d-57907a03b225/63720031-826d-4f35-b533-e13be36e152c',
      },
    ],
  },
  {
    id: 'gente-e-gestao',
    title: 'Gente e Gestão',
    data: { roles: ['User', 'Admin'] },
    type: 'collapsable',
    icon: 'mat_outline:people_alt',
    children: [
      {
        data: { roles: ['User', 'Admin'] },
        id: 'indicadores',
        title: 'Indicadores',
        restrict: false,
        type: 'basic',
        link: 'view-report/4cfaaf2a-fee2-43ac-a756-9c038bee934e/63720031-826d-4f35-b533-e13be36e152c',
      },
      {
        data: { roles: ['User', 'Admin'] },
        id: 'diversidade',
        title: 'Diversidade',
        restrict: false,
        type: 'basic',
        link: 'view-report/28c34e00-8391-4506-9d33-503d09bd21ea/63720031-826d-4f35-b533-e13be36e152c',
      },
    ],
  },
  {
    id: 'operacao',
    title: 'Operação',
    type: 'collapsable',
    icon: 'mat_solid:account_tree',
    data: { roles: ['Admin', 'User'] },
    children: [
      {
        id: 'monitoramento',
        data: { roles: ['User', 'Admin'] },
        restrict: false,

        title: 'Monitoramento',
        type: 'basic',
        link: 'view-report/4a6f3b19-88c4-4547-802e-8964810cfa66/395a994f-9f0f-4a54-be92-2d3113e27e1c',
      },
      {
        data: { roles: ['User', 'Admin'] },
        id: 'Suporte',
        title: 'Suporte',
        restrict: false,
        type: 'basic',
        link: 'view-report/b88111ee-086c-474a-9114-e28e61e5b291/63720031-826d-4f35-b533-e13be36e152c',
      },
      {
        data: { roles: ['User', 'Admin'] },
        id: 'FunilVendas',
        title: 'Funil de Vendas',
        restrict: false,
        type: 'basic',
        link: 'view-report/64026aef-cffa-4a80-8649-a9a9a9b0ac7c/63720031-826d-4f35-b533-e13be36e152c',
      },
      {
        data: { roles: ['User', 'Admin'] },
        id: 'Projetos',
        title: 'Projetos',
        restrict: false,
        type: 'basic',
        link: 'view-report/ae93e5d8-57f3-41bd-baf1-80910227fe61/63720031-826d-4f35-b533-e13be36e152c',
      },
      {
        data: { roles: ['User', 'Admin'] },
        id: 'Refinaria',
        restrict: false,
        title: 'Refinaria',
        type: 'basic',
        link: 'view-report/f07e55d2-83cf-4cc5-a91d-91a9ffa35732/63720031-826d-4f35-b533-e13be36e152c',
      },
      {
        data: { roles: ['User', 'Admin'] },
        id: 'Logistica',
        title: 'Logistica',
        type: 'basic',
        link: 'view-report/28348470-36ad-4d53-9344-11fe90718d3c/63720031-826d-4f35-b533-e13be36e152c',
      },
    ],
  },
];
const ROLES = {
  User: 'ca21241b-a37d-4e6f-bbb6-26643d3cdd99',
  Admin: '6a203390-8389-49ca-aa0e-6a14ba7815bc',
  Master: '41dd767c-45d6-437d-9ccb-9a4987e07505',
};
interface IrouteChild {
  data: {
    roles: string[];
  };
  id: string;
  title: string;
  type: string;
  restrict: false;
  report_id: string;
  group_id: string;
  page_group_id: string;
  link: string;
}
export async function insertRoutes(prisma: PrismaClient) {
  const parentRoutes = [];
  const childRoutes: IrouteChild[] = [];

  // Separa as rotas pai e rotas filho
  for (const route of routes) {
    if (route.children) {
      const { children, ...parentRoute } = route;
      parentRoute.id = randomUUID(); // Função para gerar um GUID
      parentRoutes.push(parentRoute);

      for (const child of children) {
        const [report_id, group_id] = child.link.split('/').slice(1);
        child['report_id'] = report_id;
        child['group_id'] = group_id;
        child['report_type'] = 'report';
        child['page_group_id'] = parentRoute.id;
        child.id = randomUUID();
        childRoutes.push(child as any);
      }
    } else {
      parentRoutes.push(route);
    }
  }
  // Função para inserir dados no banco de dados usando o Prisma
  for (const parentRoute of parentRoutes) {
    await prisma.page_Group.create({
      data: {
        id: parentRoute.id,
        title: parentRoute.title,
        icon: parentRoute.icon,
        formated_title: parentRoute.title
          .split(' ')
          .join('-')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, ''),
      },
    });
    for (const childRoute of childRoutes) {
      if (childRoute.page_group_id === parentRoute.id) {
        const createPage = await prisma.page.create({
          data: {
            report_type: 'report',
            id: childRoute.id,
            type: childRoute.type,
            title: childRoute.title,
            link: childRoute.link,
            group_id: childRoute.group_id,
            report_id: childRoute.report_id,
            page_group_id: childRoute.page_group_id,
            formated_title: childRoute.title
              .split(' ')
              .join('-')
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, ''),
          },
        });
        await prisma.page_Role.createMany({
          data: childRoute.data.roles.map((r) => ({
            page_id: createPage.id,
            rls_id: ROLES[r],
          })),
        });
        const TENANTS = {
          TENANT1: 'd6c5a0ad-9723-421d-ba63-897aa9f59c19',
          MASTER: '3a4dc251-deea-4d2b-b6fb-8a067944b94e',
        };
        await Promise.all([
          await prisma.tenant_Page.createMany({
            data: [TENANTS.MASTER].map((t) => ({
              page_id: childRoute.id,
              tenant_id: t,
            })),
          }),
        ]);
      }
    }
  }
}

import { ApiProperty } from '@nestjs/swagger';

export class PageGroup {
  @ApiProperty({ description: 'Identificador do grupo da página' })
  id: string;

  @ApiProperty({ description: 'Título do grupo da página' })
  title: string;

  @ApiProperty({ description: 'Título formatado do grupo da página' })
  formated_title: string;

  @ApiProperty({ description: 'Indica se a rota possui restrição de acesso' })
  restrict: boolean;

  @ApiProperty({ description: 'Ícone associado ao grupo da página' })
  icon: string;
}

export class UserRoute {
  @ApiProperty({ description: 'Identificador da rota' })
  id: string;

  @ApiProperty({ description: 'Tipo da rota (basic, advanced, etc.)' })
  type: string;

  @ApiProperty({ description: 'Tipo de página associada (report, page, etc.)' })
  page_type: string;

  @ApiProperty({ description: 'Título formatado da rota' })
  formated_title: string;

  @ApiProperty({ description: 'Título da rota' })
  title: string;

  @ApiProperty({ description: 'Descrição do painel' })
  descricao_painel: string | null; // Tipo union para permitir null

  @ApiProperty({ description: 'Nome do responsável pelo painel' })
  nome_responsavel: string | null; // Tipo union para permitir null

  @ApiProperty({ description: 'Email do responsável pelo painel' })
  email_responsavel: string | null; // Tipo union para permitir null

  @ApiProperty({ description: 'Link de acesso à rota' })
  link: string;

  @ApiProperty({ description: 'Identificador do grupo' })
  group_id: string | null; // Marcado como opcional com '?'

  @ApiProperty({ description: 'Identificador do relatório' })
  report_id: string | null; // Marcado como opcional com '?'

  @ApiProperty({ description: 'Indica se possui dados sensíveis' })
  possui_dados_sensiveis: boolean;

  @ApiProperty({ description: 'Indica se a rota possui restrição de acesso' })
  restrict: boolean;

  @ApiProperty({ description: 'Nome da tabela associada (se houver)' })
  table_name: string;

  @ApiProperty({ description: 'Identificador do grupo da página' })
  page_group_id: string;

  @ApiProperty({ type: PageGroup })
  Page_Group: PageGroup;

  @ApiProperty({ type: [String], description: 'Roles do usuário para a rota' })
  Page_Role: string[];
}

export class TfaResponse {
  @ApiProperty({ description: 'Token de acesso' })
  token: string;

  @ApiProperty({ description: 'Identificador do tenant' })
  tenant_id?: string; // Marcado como opcional com '?'

  @ApiProperty({ description: 'Imagem da aplicação' })
  app_image?: string; // Marcado como opcional com '?'

  @ApiProperty({ description: 'Imagem do tenant' })
  tenant_image?: string; // Marcado como opcional com '?'

  @ApiProperty({ description: 'Cor do tema do tenant' })
  tenant_color: string;
  @ApiProperty({ description: 'Email do usuário' })
  user_email: string;

  @ApiProperty({
    type: [UserRoute],
    description: 'Rotas acessíveis pelo usuário',
  })
  userRoutes: UserRoute[];
}

export class RoutesResponse {
  @ApiProperty({ type: [UserRoute] })
  userRoutes: UserRoute[];
}

export class AppImageResponse {
  @ApiProperty()
  app_image: string;

  @ApiProperty()
  tentant_image: string;

  @ApiProperty()
  bg_color: string;
}

export class Token {
  @ApiProperty({
    required: true,
  })
  token: string;
}

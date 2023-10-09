BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Rls] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Rls_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Tenant] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_name] NVARCHAR(1000) NOT NULL,
    [tenant_cnpj] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Tenant_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [active] BIT NOT NULL,
    [restrict] BIT CONSTRAINT [Tenant_restrict_df] DEFAULT 0,
    CONSTRAINT [Tenant_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Request_admin_access] (
    [id] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Request_admin_access_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [company_description] NVARCHAR(1000) NOT NULL,
    [company_name] NVARCHAR(1000) NOT NULL,
    [company_cnpj] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000),
    [description] NVARCHAR(1000) NOT NULL,
    [profession] NVARCHAR(1000) NOT NULL,
    [blocked] BIT NOT NULL CONSTRAINT [Request_admin_access_blocked_df] DEFAULT 0,
    [accept] BIT NOT NULL CONSTRAINT [Request_admin_access_accept_df] DEFAULT 0,
    CONSTRAINT [Request_admin_access_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[User_Auth] (
    [id] NVARCHAR(1000) NOT NULL,
    [secret] NVARCHAR(1000),
    [reset_pass] NVARCHAR(1000),
    [password_hash] NVARCHAR(1000),
    [anchor] BIT NOT NULL,
    [normalized_contact_email] NVARCHAR(1000),
    [last_access] DATETIME2,
    [user_id] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [User_Auth_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_Auth_user_id_key] UNIQUE NONCLUSTERED ([user_id])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [born_date] DATE,
    [personal_email] NVARCHAR(1000),
    [contact_email] NVARCHAR(1000) NOT NULL,
    [profession] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000),
    [rls_id] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_personal_email_key] UNIQUE NONCLUSTERED ([personal_email])
);

-- CreateTable
CREATE TABLE [dbo].[Tenant_Page] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    [page_id] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Tenant_Page_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[User_Page] (
    [id] NVARCHAR(1000) NOT NULL,
    [tenant_page_id] NVARCHAR(1000) NOT NULL,
    [user_id] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [User_Page_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Page_Role] (
    [id] NVARCHAR(1000) NOT NULL,
    [page_id] NVARCHAR(1000) NOT NULL,
    [rls_id] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Page_Role_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Page_Group] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [formated_title] NVARCHAR(1000),
    [restrict] BIT CONSTRAINT [Page_Group_restrict_df] DEFAULT 0,
    [icon] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Page_Group_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Page] (
    [id] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [report_type] NVARCHAR(1000),
    [formated_title] NVARCHAR(1000),
    [title] NVARCHAR(1000) NOT NULL,
    [descricao_painel] NVARCHAR(1000),
    [responsavel] NVARCHAR(1000),
    [link] NVARCHAR(1000),
    [group_id] NVARCHAR(1000),
    [report_id] NVARCHAR(1000),
    [possui_dados_sensiveis] BIT CONSTRAINT [Page_possui_dados_sensiveis_df] DEFAULT 0,
    [restrict] BIT CONSTRAINT [Page_restrict_df] DEFAULT 0,
    [table_name] NVARCHAR(1000),
    [page_group_id] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Page_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[funcionarios_table] (
    [id] NVARCHAR(1000) NOT NULL,
    [nomeEmpresa] NVARCHAR(1000) NOT NULL,
    [matricula] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [cargos] NVARCHAR(1000) NOT NULL,
    [dataAdmissao] DATETIME2 NOT NULL,
    [area] NVARCHAR(1000) NOT NULL,
    [salario] FLOAT(53) NOT NULL,
    [sexo] NVARCHAR(1000) NOT NULL,
    [cutis] NVARCHAR(1000) NOT NULL,
    [dataNascimento] DATETIME2 NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [vinculoEmpregaticio] NVARCHAR(1000) NOT NULL,
    [situacaoEmpregado] NVARCHAR(1000) NOT NULL,
    [grauInstrucao] NVARCHAR(1000) NOT NULL,
    [pcd] BIT NOT NULL,
    [desligado] BIT NOT NULL,
    [dataDesligamento] DATETIME2,
    [motivoDesligamento] NVARCHAR(1000),
    [timestamp] DATETIME2 NOT NULL CONSTRAINT [funcionarios_table_timestamp_df] DEFAULT CURRENT_TIMESTAMP,
    [tenant_id] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [funcionarios_table_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Request_admin_access] ADD CONSTRAINT [Request_admin_access_tenant_id_fkey] FOREIGN KEY ([tenant_id]) REFERENCES [dbo].[Tenant]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[User_Auth] ADD CONSTRAINT [User_Auth_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_tenant_id_fkey] FOREIGN KEY ([tenant_id]) REFERENCES [dbo].[Tenant]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_rls_id_fkey] FOREIGN KEY ([rls_id]) REFERENCES [dbo].[Rls]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Tenant_Page] ADD CONSTRAINT [Tenant_Page_tenant_id_fkey] FOREIGN KEY ([tenant_id]) REFERENCES [dbo].[Tenant]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Tenant_Page] ADD CONSTRAINT [Tenant_Page_page_id_fkey] FOREIGN KEY ([page_id]) REFERENCES [dbo].[Page]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[User_Page] ADD CONSTRAINT [User_Page_tenant_page_id_fkey] FOREIGN KEY ([tenant_page_id]) REFERENCES [dbo].[Tenant_Page]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[User_Page] ADD CONSTRAINT [User_Page_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Page_Role] ADD CONSTRAINT [Page_Role_page_id_fkey] FOREIGN KEY ([page_id]) REFERENCES [dbo].[Page]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Page_Role] ADD CONSTRAINT [Page_Role_rls_id_fkey] FOREIGN KEY ([rls_id]) REFERENCES [dbo].[Rls]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Page] ADD CONSTRAINT [Page_page_group_id_fkey] FOREIGN KEY ([page_group_id]) REFERENCES [dbo].[Page_Group]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[funcionarios_table] ADD CONSTRAINT [funcionarios_table_tenant_id_fkey] FOREIGN KEY ([tenant_id]) REFERENCES [dbo].[Tenant]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

export const message_book = {
  request_new_tenant: {
    accept_new_tennat: (token): { content: string; subject: string } => ({
      subject: 'Sua solicitação foi aceita',
      content: `<!DOCTYPE html>
    <html>
      <head>
        <title>Active Portal do Cliente - Seu cadastro foi aceito</title>
    
      </head>
      <body>
      <table align="center" width="300" height="300" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #0f172a;">
      <tr>
        <td align="center" valign="middle" style="padding: 20px;">
          <p style="margin-bottom: 20px; font-size: 16px; color: #ffffff; font-family: Arial, sans-serif;">Nossos aprovadores avaliaram seus dados e configuraram um Ambiente só seu!!!</p>
    
          <h2 style="margin-top: 0; font-size: 24px; color: #ffffff; font-family: Arial, sans-serif;">Conclua seu cadastro</h2>
          <p style="margin-bottom: 20px; font-size: 16px; color: #ffffff; font-family: Arial, sans-serif;">Crie sua senha de acesso do Active Portal do Cliente</p>
          <p style="margin: 0;">
            <a href="${process.env['FRONT_BASE_URL']}/#/auth/sign-up/${token}"
              style="display: inline-block; padding: 20px 20px; background-color: #ffffff; color: #0f172a; font-size: 16px; text-decoration: none; font-family: Arial, sans-serif;"
            >
              Criar Senha
            </a>
          </p>
        </td>
      </tr>
    </table>
      </body>
    </html>`,
    }),
    email_to_confirm_new_tenant_request_access: (link) => ({
      subject: 'Confirme seu identidade',
      content: `<!DOCTYPE html>
    <html>
      <head>
        <title>Confirmação de Email</title>
      </head>
      <body>
      <table align="center" width="300" height="300" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #0f172a;">
      <tr>
        <td align="center" valign="middle" style="padding: 20px;">
          <h2 style="margin-top: 0; font-size: 24px; color: #ffffff; font-family: Arial, sans-serif;">Ultimo passo</h2>
          <p style="margin-bottom: 20px; font-size: 16px; color: #ffffff; font-family: Arial, sans-serif;">clique abaixo para confirmar seu email</p>
          <p style="margin: 0;">
            <a href="${link}" style="display: inline-block;margin-top: 10px; text-color: black; padding: 20px 20px; background-color: #ffffff; color: #0f172a; font-size: 16px; text-decoration: none; font-family: Arial, sans-serif;">Confirme Aqui</a>
          </p>
        </td>
      </tr>
    </table>
      </body>
    </html>`,
    }),
  },
  auth: {
    request_new_sign_up: (token, requestAccess) => ({
      subject: 'Conclua seu CADASTRO no portal embedded Active BI',
      content: `<!DOCTYPE html>
    <html>
  <head>
    <meta charset="UTF-8" />
    <title>ActiveBi - Confirme seu Cadastro</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
    "
  >
    <!-- Container principal -->
    <table
      align="center"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="
        max-width: 480px;
        margin: auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      "
    >
      <!-- Header sólido -->
      <tr>
        <td
          style="
            background-color: #0f172a;
            padding: 28px;
            text-align: center;
            color: #ffffff;
          "
        >
          <img
            src="uploads/active_logo.png"
            alt="Rocket"
            style="display: block; margin: auto"
          />
          <h1 style="margin: 16px 0 0; font-size: 22px; font-weight: bold">
            Bem-vindo ao Portal do Cliente
          </h1>
          <p style="margin: 8px 0 0; font-size: 15px; opacity: 0.85">
            Seu acesso foi solicitado com sucesso!
          </p>
        </td>
      </tr>

      <!-- Corpo -->
      <tr>
        <td style="padding: 28px; text-align: center; color: #333">
          <p style="font-size: 16px; margin-bottom: 24px">
            Conclua agora mesmo seu cadastro e aproveite todos os recursos do
            <strong>ActiveBI Embedded</strong>.
          </p>

          <!-- Botão CTA -->
          <a
            href="${process.env['FRONT_BASE_URL']}/#/auth/sign-up/${token}"
            style="
              display: inline-block;
              background-color: #3b82f6;
              color: #ffffff;
              padding: 14px 28px;
              font-size: 16px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: bold;
            "
          >
            Criar Senha
          </a>
        </td>
      </tr>

      <!-- Rodapé -->
      <tr>
        <td
          style="
            background-color: #f4f6f8;
            padding: 16px;
            text-align: center;
            font-size: 12px;
            color: #777;
          "
        >
          Se você não solicitou este acesso, ignore esta mensagem.
        </td>
      </tr>
    </table>
  </body>
</html>
`,
    }),
    security_login: (totp: string) => ({
      subject: `Seu código é ${totp}`,
      content: `<!DOCTYPE html>
    <html>
      <head>
        <title>Código de segurança</title>
    
      </head>
      <body>
      <table align="center" width="300" height="300" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #0f172a;">
      <tr>
        <td align="center" valign="middle" style="padding: 20px;">
          <h2 style="margin-top: 0; font-size: 24px; color: #ffffff; font-family: Arial, sans-serif;">Código de segurança</h2>
          <p style="margin-bottom: 20px; font-size: 16px; color: #ffffff; font-family: Arial, sans-serif;">Copie o código abaixo para acessar a aplicação</p>
          <p style="margin: 0;">
            <p style="display: inline-block; padding: 20px 20px; background-color: #ffffff; color: #0f172a; font-size: 16px; text-decoration: none; font-family: Arial, sans-serif;">${totp}</a>
          </p>
        </td>
      </tr>
    </table>
      </body>
    </html>`,
    }),
    email_to_reset_pass: (link: string) => ({
      subject: `Cadastre sua nova senha`,
      content: `<!DOCTYPE html>
       <html>
         <head>
           <title>Redefinir senha</title>
      
         </head>
         <body>
         <table align="center" width="300" height="300" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #0f172a;">
         <tr>
           <td align="center" valign="middle" style="padding: 20px;">
             <h2 style="margin-top: 0; font-size: 24px; color: #ffffff; font-family: Arial, sans-serif;">Redefinir Senha</h2>
             <p style="margin-bottom: 20px; font-size: 16px; color: #ffffff; font-family: Arial, sans-serif;">clique abaixo para redefinir sua senha.</p>
             <p style="margin: 0;">
               <a href="${link}" style="display: inline-block; padding: 20px 20px; background-color: #ffffff; color: #0f172a; font-size: 16px; text-decoration: none; font-family: Arial, sans-serif;">Acesse Aqui</a>
             </p>
           </td>
         </tr>
       </table>
         </body>
       </html>`,
    }),
  },
};

// export const emailToResetPass = (link) => `<!DOCTYPE html>
// <html>
//   <head>
//     <title>Redefinir senha</title>

//   </head>
//   <body>
//   <table align="center" width="300" height="300" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #0f172a;">
//   <tr>
//     <td align="center" valign="middle" style="padding: 20px;">
//       <h2 style="margin-top: 0; font-size: 24px; color: #ffffff; font-family: Arial, sans-serif;">Redefinir Senha</h2>
//       <p style="margin-bottom: 20px; font-size: 16px; color: #ffffff; font-family: Arial, sans-serif;">clique abaixo para redefinir sua senha.</p>
//       <p style="margin: 0;">
//         <a href="${link}" style="display: inline-block; padding: 20px 20px; background-color: #ffffff; color: #0f172a; font-size: 16px; text-decoration: none; font-family: Arial, sans-serif;">Acesse Aqui</a>
//       </p>
//     </td>
//   </tr>
// </table>
//   </body>
// </html>`;

export const message_book = {
  request_new_tenant: {
    accept_new_tennat: (token): { content: string; subject: string } => ({
      subject: 'Sua solicitação foi aceita',
      content: `<!DOCTYPE html>
    <html>
      <head>
        <title>Active PME - Seu cadastro foi aceito</title>
    
      </head>
      <body>
      <table align="center" width="300" height="300" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #0f172a;">
      <tr>
        <td align="center" valign="middle" style="padding: 20px;">
          <p style="margin-bottom: 20px; font-size: 16px; color: #ffffff; font-family: Arial, sans-serif;">Nossos aprovadores avaliaram seus dados e configuraram um Ambiente só seu!!!</p>
    
          <h2 style="margin-top: 0; font-size: 24px; color: #ffffff; font-family: Arial, sans-serif;">Conclua seu cadastro</h2>
          <p style="margin-bottom: 20px; font-size: 16px; color: #ffffff; font-family: Arial, sans-serif;">Crie sua senha de acesso do Active PME</p>
          <p style="margin: 0;">
            <a href="${process.env['FRONT_BASE_URL']}auth/sign-up/${token}"
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
            <a href="${link}" style="display: inline-block; padding: 20px 20px; background-color: #ffffff; color: #0f172a; font-size: 16px; text-decoration: none; font-family: Arial, sans-serif;">Confirme Aqui</a>
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
      subject: 'Seu ingresso foi solicitado',
      content: `<!DOCTYPE html>
    <html>
      <head>
        <title>Active PME - Seu acesso foi solicitado</title>
    
      </head>
      <body>
      <table align="center" width="300" height="300" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #0f172a;">
      <tr>
        <td align="center" valign="middle" style="padding: 20px;">
          <p style="margin-bottom: 20px; font-size: 16px; color: #ffffff; font-family: Arial, sans-serif;">${requestAccess}</p>
    
          <h2 style="margin-top: 0; font-size: 24px; color: #ffffff; font-family: Arial, sans-serif;">Esse usuário solicitou seu ingresso no Active PME</h2>
          <p style="margin-bottom: 20px; font-size: 16px; color: #ffffff; font-family: Arial, sans-serif;">Conclua agora mesmo seu cadastro!</p>
          <p style="margin: 0;">
            <a href="${process.env['FRONT_BASE_URL']}auth/sign-up/${token}"
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

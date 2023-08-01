export const emailToRequestAccess = (link) => `<!DOCTYPE html>
<html>
  <head>
    <title>Redefinir senha</title>

  </head>
  <body>
  <table align="center" width="300" height="300" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #1E293F;">
  <tr>
    <td align="center" valign="middle" style="padding: 20px;">
      <h2 style="margin-top: 0; font-size: 24px; color: #ffffff; font-family: Arial, sans-serif;">Redefinir Senha</h2>
      <p style="margin-bottom: 20px; font-size: 16px; color: #ffffff; font-family: Arial, sans-serif;">clique abaixo para redefinir sua senha.</p>
      <p style="margin: 0;">
        <a href="${link}" style="display: inline-block; padding: 20px 20px; background-color: #ffffff; color: #1E293F; font-size: 16px; text-decoration: none; font-family: Arial, sans-serif;">Acesse Aqui</a>
      </p>
    </td>
  </tr>
</table>
  </body>
</html>`;

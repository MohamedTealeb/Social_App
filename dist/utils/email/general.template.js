"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalEmail = void 0;
const generalEmail = ({ title, message, tags }) => {
    const tagsHtml = tags && tags.length > 0
        ? `<tr>
        <td align="center" style="padding:20px;">
          <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;">
            ${tags.map(tag => `<span style="background:#630E2B;color:#fff;padding:4px 12px;border-radius:16px;font-size:12px;font-weight:500;">${tag}</span>`).join('')}
          </div>
        </td>
      </tr>`
        : '';
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f5f7fb;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding:40px 0;">
          <table width="600" border="0" cellspacing="0" cellpadding="0" 
            style="background:#ffffff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background:#630E2B;padding:30px;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png" 
                  alt="Logo" width="80" style="display:block;" />
              </td>
            </tr>
            
            <!-- Title -->
            <tr>
              <td align="center" style="padding:30px 20px 10px 20px;">
                <h1 style="margin:0;color:#222;font-size:24px;font-weight:600;">${title}</h1>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding:0 40px 20px 40px;color:#555;font-size:15px;line-height:1.6;">
                <div style="white-space:pre-wrap;">${message}</div>
              </td>
            </tr>

            <!-- Tags -->
            ${tagsHtml}

            <!-- Footer -->
            <tr>
              <td align="center" style="padding:30px 20px;background:#f9f9f9;">
                <h3 style="margin:0 0 15px 0;font-size:16px;color:#333;">Stay Connected</h3>
                <p style="margin:0;color:#666;font-size:14px;">Thank you for using our Social App!</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
};
exports.generalEmail = generalEmail;
//# sourceMappingURL=general.template.js.map
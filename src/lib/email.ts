
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export const sendThankYouEmail = async (to: string, name: string, amount: number) => {
  const msg = {
    to,
    from: 'no-repeat@softwhere.com.co',
    subject: '¡Gracias por tu donación a ELEVA CESA!',
    html: `
      <div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin: 0 auto;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #002395; padding: 40px 30px;">
              <h1 style="color: #ffffff; font-size: 56px; margin: 0;">¡Gracias!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td bgcolor="#ffffff" style="padding: 40px 30px;">
              <h2 style="font-size: 24px; color: #333333; text-align: center;">¡Gracias por elevar el futuro del liderazgo en Colombia!</h2>
              <p style="font-size: 16px; line-height: 1.5; color: #555555; text-align: center;">
                Queremos darte las gracias por tu generoso aporte. Tu donación no es solo un gesto de solidaridad: es una inversión en el futuro del país.
              </p>
              <p style="font-size: 16px; line-height: 1.5; color: #555555; text-align: center;">
                Gracias a ti, más jóvenes con talento y propósito tendrán la oportunidad de acceder a una educación de excelencia y convertirse en los líderes que transformarán nuestras organizaciones y comunidades.
              </p>
              <p style="font-size: 16px; line-height: 1.5; color: #555555; text-align: center;">
                Tu aporte es fundamental en este camino de formación de líderes que forman líderes.
              </p>
              <p style="font-size: 16px; line-height: 1.5; color: #555555; text-align: center;">
                Juntos, estamos construyendo un legado con propósito.<br/>
                ELEVA, el programa filantrópico del CESA<br/>
                Líderes que forman líderes
              </p>
              <div style="margin-top: 20px; padding: 15px; background-color: #f2f2f2; border-radius: 5px;">
                  <h3 style="font-size: 18px; color: #333; text-align: center; margin-top:0;">Detalles de tu donación:</h3>
                  <p style="font-size: 16px; line-height: 1.5; color: #555555; text-align: center; margin: 5px 0;">
                      <strong>Monto:</strong> ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount)}
                  </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #002395; padding: 30px;">
            </td>
          </tr>

        </table>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('Donation confirmation email sent successfully.');
  } catch (error) {
    console.error('Error sending donation confirmation email:', error);
    throw new Error(`Failed to send donation email: ${error}`);
  }
};

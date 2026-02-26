import sgMail from "@sendgrid/mail";
import 'dotenv/config';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    const { correo } = await req.json();

    if (!correo) return new Response(JSON.stringify({ success: false, message: "Correo es obligatorio" }), { status: 400 });

    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    const msg = {
      to: correo,
      from: {
        email: process.env.SENDGRID_SENDER_EMAIL,
        name: process.env.SENDGRID_SENDER_NAME
      },
      subject: "Código de verificación",
      text: `Tu código de verificación es: ${codigo}`,
      html: `<p>Tu código de verificación es: <b>${codigo}</b></p>`,
    };

    await sgMail.send(msg);

    return new Response(JSON.stringify({ success: true, codigo }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, message: "Error enviando correo" }), { status: 500 });
  }
}

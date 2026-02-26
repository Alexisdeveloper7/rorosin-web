// app/api/mail/recuperacion/route.js
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    const { email, codigo } = await req.json();

    await sgMail.send({
      to: email,
      from: `${process.env.SENDGRID_SENDER_NAME} <${process.env.SENDGRID_SENDER_EMAIL}>`,
      subject: "Recuperación de contraseña",
      text: `Tu código para recuperar la contraseña es: ${codigo}`,
      html: `<p>Tu código para recuperar la contraseña es: <strong>${codigo}</strong></p>`,
    });

    return new Response(JSON.stringify({ mensaje: "Correo de recuperación enviado" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ mensaje: "Error enviando correo" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

const path = require("path");
const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function sanitize(value = "") {
  return String(value).replace(/[<>]/g, "").trim();
}

function validateEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getTransporter() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("Configuração SMTP incompleta no arquivo .env");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/esc", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "esc.html"));
});

app.get("/esc.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "esc.html"));
});

app.post("/api/contact", async (req, res) => {
  try {
    const nome = sanitize(req.body.nome);
    const empresa = sanitize(req.body.empresa);
    const telefone = sanitize(req.body.telefone);
    const email = sanitize(req.body.email);
    const mensagem = sanitize(req.body.mensagem);
    const botField = sanitize(req.body["bot-field"]);

    if (botField) {
      return res.status(200).json({
        ok: true,
        message: "Mensagem recebida."
      });
    }

    if (!nome || !empresa || !telefone || !email || !mensagem) {
      return res.status(400).json({
        ok: false,
        message: "Preencha todos os campos obrigatórios."
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        ok: false,
        message: "Informe um e-mail válido."
      });
    }

    const recipient = process.env.CONTACT_RECIPIENT || "Contato@araguayaportal.com.br";
    const fromName = process.env.MAIL_FROM_NAME || "Site Araguaya";
    const fromAddress = process.env.MAIL_FROM_ADDRESS || process.env.SMTP_USER;

    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: recipient,
      replyTo: email,
      subject: `Novo contato pelo site - ${nome} / ${empresa}`,
      text: `
Novo contato enviado pelo site da Araguaya

Nome: ${nome}
Empresa: ${empresa}
Telefone: ${telefone}
E-mail: ${email}

Mensagem:
${mensagem}
      `.trim(),
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; color: #2b2523; line-height: 1.6;">
          <h2 style="color: #7e1f23;">Novo contato enviado pelo site da Araguaya</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Empresa:</strong> ${empresa}</p>
          <p><strong>Telefone:</strong> ${telefone}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Mensagem:</strong></p>
          <div style="padding: 14px; background: #faf8f6; border: 1px solid #eee; border-radius: 8px;">
            ${mensagem.replace(/\n/g, "<br>")}
          </div>
        </div>
      `
    });

    return res.status(200).json({
      ok: true,
      message: "Mensagem enviada com sucesso. Em breve nossa equipe entrará em contato."
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);

    return res.status(500).json({
      ok: false,
      message: "Não foi possível enviar sua mensagem agora. Tente novamente em instantes."
    });
  }
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
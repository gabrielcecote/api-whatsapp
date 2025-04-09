import express from "express";
import whatsappService from "../services/whatsapp.services.js";

const router = express.Router();

router.get("/qrcode", async (req, res) => {
  const qrImg = whatsappService.getQRImage();
  if (!qrImg) {
    return res.status(404).send("QR Code não disponível no momento");
  }

  const base64Data = qrImg.replace(/^data:image\/png;base64,/, "");
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": base64Data.length
  });
  res.end(Buffer.from(base64Data, "base64"));
});

router.post("/send-message", async (req, res) => {
  const { number, message } = req.body;
  
  if (!number || !message) {
    return res.status(400).json({ error: "Número e mensagem são obrigatórios" });
  }

  try {
    await whatsappService.sendMessage(number, message);
    res.json({ success: true, message: "Mensagem enviada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Falha ao enviar mensagem" });
  }
});

export default router;
import express from "express";
import whatsappService from "../services/whatsapp.services.ts";

const router = express.Router();

router.get("/qrcode", async (req, res): Promise<void> => {
  const qrImg = whatsappService.getQRImage();
  if (!qrImg) {
    res.status(404).send("QR Code não disponível no momento");
    return;
  }

  const base64Data = qrImg.replace(/^data:image\/png;base64,/, "");
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": base64Data.length
  });
  res.end(Buffer.from(base64Data, "base64"));
});

router.post("/send-message", async (req, res): Promise<void> => {
  const { number, message } = req.body;
  
  if (!number || !message) {
    res.status(400).json({ error: "Número e mensagem são obrigatórios" });
    return;
  }

  try {
    await whatsappService.sendMessage(number, message);
    res.json({ success: true, message: "Mensagem enviada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Falha ao enviar mensagem" });
  }
});

export default router;
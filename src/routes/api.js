import express from "express";
import whatsappRoutes from "./whatsapp.js";
import whatsappService from "../services/whatsapp.services.js";
import clearAuthInfo from "../utils/helpers.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

router.delete("/auths", async (req, res) => {
  try {
    clearAuthInfo();
    const result = await whatsappService.restartConnection();
    
    if (result.success) {
      res.json({ message: "Credenciais limpas e conexão reiniciada!" });
    } else {
      res.status(500).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

router.use("/whatsapp", whatsappRoutes);

export default router;
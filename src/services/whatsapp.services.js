import { DisconnectReason, makeWASocket, useMultiFileAuthState } from "baileys";
import QRCode from "qrcode";
import P from "pino";
import { Boom } from "@hapi/boom";
import { PORT } from "../server.js";

class WhatsAppService {
  constructor() {
    this.sock = null;
    this.qrImg = null;
  }

  async init() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

    this.sock = makeWASocket({
      auth: state,
      logger: P({ level: "silent" }),
      browser: ["Baileys API", "Chrome", "1.0.0"],
      syncFullHistory: false,
      getMessage: async () => undefined,
      shouldSyncHistoryMessage: () => false,
      shouldIgnoreJid: () => true
    });

    this.setupEventHandlers(saveCreds);
  }

  setupEventHandlers(saveCreds) {
    this.sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
      //console.log(connection);
      if (qr) {
        this.qrImg = await QRCode.toDataURL(qr);
        console.log("QR Code gerado!");
        console.log("Leia o QRCode em http://localhost:" + PORT + "/api/whatsapp/qrcode");
      }
      if (connection === "open") console.log("Conectado ao WhatsApp!");
      else if (connection === "close") {
        const motivoDesconexao = new Boom(lastDisconnect.error).output.statusCode;
        if (motivoDesconexao === DisconnectReason.restartRequired) {
          console.log("Reiniciando conexão...");
          this.init();
        }
      }
    });

    this.sock.ev.on("creds.update", saveCreds);
  }

  async sendMessage(number, message) {
    const formattedNumber = this.formatNumber(number);
    await this.sock.sendMessage(formattedNumber, { text: message });
  }

  async restartConnection() {
    try {
      if (this.sock) {
        this.sock.end();
        this.sock = null;
      }
      await this.init();
      return { success: true, message: "Conexão reiniciada com sucesso" };
    } catch (error) {
      console.error("Erro ao reiniciar conexão:", error);
      return { success: false, message: "Falha ao reiniciar conexão" };
    }
  }

  formatNumber(number) {
    let num = number.replace(/\D/g, "");
    if (!num.startsWith("55")) num = "55" + num;
    return num + "@s.whatsapp.net";
  }

  getQRImage() {
    return this.qrImg;
  }
}

export default new WhatsAppService();
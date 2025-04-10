import app from "./app.ts";

export const PORT = 44444;

/* Rotas da API

GET - http://localhost:44444/api/test -- teste de funcionamento da API
GET - http://localhost:44444/api/whatsapp/qrcode -- QR Code para autenticação
POST - http://localhost:44444/api/whatsapp/send-message -- Enviar mensagem (body: { number: "numero", message: "mensagem" })
DELETE - http://localhost:44444/api/auths -- Limpar credenciais e reiniciar conexão com o WhatsApp

*/
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

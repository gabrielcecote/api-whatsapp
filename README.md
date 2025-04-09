API Whatsapp feito usando [Baileys](https://baileys.wiki/docs/intro)

# Rotas

## Teste da API
`GET` `/api/test`  
Verifica se a API está funcionando  

## Autenticação WhatsApp
`GET` `/api/whatsapp/qrcode`  
Gera QR Code para login  
**Retorna:** Imagem PNG  

## Enviar Mensagem
`POST` `/api/whatsapp/send-message`  
**Body:** 
```json
{
  "number": "numero (Ex.: 31912345678)",
  "message": "Texto da mensagem"
}
```

## Reiniciar credenciais
`DELETE` `/api/auths`  
Deleta as credenciais salvas e reinicia a conexão

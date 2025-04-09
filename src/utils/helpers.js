import fs from "fs";

function clearAuthInfo() {
   const authFolder = "auth_info_baileys";
   if (fs.existsSync(authFolder)) {
     fs.rmSync(authFolder, { recursive: true });
     console.log("Credenciais antigas removidas");
   }
}

export default clearAuthInfo;
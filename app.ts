import express, { type Request, type Response } from "express";
import { DailyUpdateLogic } from "./src/DailyUpdateLogic.js";
import { GitService } from "./src/GitChangeService.js";
import 'dotenv/config'; 

const app = express();
const PORT = process.env.PORT || 3000;

const gitService = new GitService();
const dailyUpdater = new DailyUpdateLogic(gitService);

app.use((req: Request, res: Response, next) => {
    console.log(`[${new Date().toISOString()}] Requisição recebida em: ${req.url}`);
    next();
});

app.get("/git-update", async (req: Request, res: Response) => {
    console.log("--- Rota /git-update acionada. Iniciando automação Git... ---");
    
    const result = await dailyUpdater.runUpdateFlow();
    
    if (result.success) {
        res.status(200).json({ 
            status: "Success",
            message: "Fluxo de atualização Git concluído. Verifique o repositório.",
            details: result.log 
        });
    } else {
        res.status(500).json({ 
            status: "Error",
            message: "Falha na execução da automação Git. Verifique os logs do servidor.",
            details: result.log 
        });
    }
});

app.listen(PORT, () => console.log(`🚀 Rodando em http://localhost:${PORT}`));
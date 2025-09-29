import express, { type Request, type Response } from "express";
import { DailyUpdateLogic } from "./src/DailyUpdateLogic.js";
import { GitService } from "./src/GitChangeService.js";
import 'dotenv/config';
import cron from "node-cron";

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

cron.schedule("2 19 * * *", () => {
    const times = Math.floor(Math.random() * 10) + 1; 
    console.log(`📅 Serão feitas ${times} execuções da rota /git-update hoje.`);

    for (let i = 0; i < times; i++) {
        const delay = Math.floor(Math.random() * 24 * 60 * 60 * 1000);

        setTimeout(async () => {
            console.log(`⏰ Execução #${i + 1} da rota /git-update`);
            await dailyUpdater.runUpdateFlow();
        }, delay);
    }
});

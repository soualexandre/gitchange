import { DailyUpdateLogic } from "./src/DailyUpdateLogic.js";
import { GitService } from "./src/GitChangeService.js";


async function main() {
    console.log("Iniciando o fluxo de atualização Git via GitHub Actions...");
    
    const gitService = new GitService();
    const dailyUpdater = new DailyUpdateLogic(gitService);

    const result = await dailyUpdater.runUpdateFlow();

    if (result.success) {
        console.log("\n==============================================");
        console.log("✅ Automação diária concluída com sucesso!");
        console.log("==============================================");
        console.log(result.log);
        
        process.exit(0); 
    } else {
        console.error("\n==============================================");
        console.error("❌ A automação falhou. Verifique os logs de erro.");
        console.error("==============================================");
        console.error(result.log);
        
        process.exit(1); 
    }
}

main();
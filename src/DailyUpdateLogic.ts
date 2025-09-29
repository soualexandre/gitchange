import { appendFileSync } from 'fs';
import path from 'path';
import { GitService } from './GitChangeService.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const BASE_PATH = path.resolve(__dirname, '..', '..');

const FILE_NAME = 'typescript_log.txt'; 
const BRANCH = 'main';

export class DailyUpdateLogic {
    private gitService: GitService;

    constructor(gitService: GitService) {
        this.gitService = gitService;
    }

  
    private makeLocalChange(): string {
        const filePath = path.join(BASE_PATH, FILE_NAME);
        const now = new Date().toLocaleString('pt-BR');
        const content = `[${now}] Triggered by TypeScript Express API.\n`;
        
        appendFileSync(filePath, content);
        return `✅ Alteração feita em ${FILE_NAME}. Conteúdo: "${content.trim()}"`;
    }

  
    public async runUpdateFlow(): Promise<{ success: boolean; log: string }> {
        let log = '';
        const commitMessage = `Automated TypeScript Update: ${new Date().toISOString()}`;

        try {
            log += this.makeLocalChange() + '\n\n';

            const pullResult = await this.gitService.pull(BRANCH);
            log += `✅ Git Pull OK. Output: ${pullResult}\n\n`;

            const addResult = await this.gitService.add(FILE_NAME);
            log += `✅ Git Add OK. Output: ${addResult}\n\n`;
            
            const commitResult = await this.gitService.commit(commitMessage);
            log += `✅ Git Commit OK. Output: ${commitResult}\n\n`;

            const pushResult = await this.gitService.push(BRANCH);
            log += `✅ Git Push OK. Output: ${pushResult}`;

            return { success: true, log };

        } catch (error) {
            log += `\n\n❌ ERRO CRÍTICO NO GIT.`;
            const errorMessage = typeof error === 'string' ? error : (error as Error).message;
            log += `\nDetalhes do Erro:\n${errorMessage}`;
            
            console.error(log); 
            return { success: false, log };
        }
    }
}
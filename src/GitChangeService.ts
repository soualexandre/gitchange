import { exec, type ExecException } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const REPO_PATH = path.resolve(__dirname, '..', '..');


export class GitService {
    private async runCommand(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            console.log(`\n> Executando: ${command}`);
            exec(command, { encoding: 'utf-8', cwd: REPO_PATH }, (error: ExecException | null, stdout: string, stderr: string) => {
                if (error) {
                    return reject(stderr || error.message);
                }
                resolve(stdout.trim());
            });
        });
    }

    public async pull(branch: string): Promise<string> {
        return this.runCommand(`git pull origin ${branch}`);
    }

    public async add(filePath: string): Promise<string> {
        return this.runCommand(`git add ${filePath}`);
    }

    public async commit(message: string): Promise<string> {
        return this.runCommand(`git commit -m "${message}"`);
    }

    public async push(branch: string): Promise<string> {
        return this.runCommand(`git push origin ${branch}`);
    }
}
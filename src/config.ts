import fs from 'fs'
import path from 'path'

export interface Config {
    instructions: string
    model: string
    diff_character_limit: number
    provider: 'openai' | 'groq'
}

const defaultConfig: Config = {
    instructions: `Please be concise, general, and make message under 10 words. 
        Also try to write in past tense, like what is done.
        If there are many details which are not related to each other, produce very general messages.`,
    model: 'llama-3.1-8b-instant',
    diff_character_limit: 64000,
    provider: 'groq',
}

export const loadConfig = (external_path?: string, cliArgs?: Partial<Config>): Config => {
    const configPath = external_path ?? path.resolve(process.cwd(), 'metagit.json')
    if (fs.existsSync(configPath)) {
        const fileConfig: Partial<Config> = JSON.parse(fs.readFileSync(configPath, 'utf8'))
        return {
            ...defaultConfig,
            ...fileConfig,
            ...cliArgs,
        } as Config
    }
    return {
        ...defaultConfig,
        ...cliArgs,
    } as Config
}

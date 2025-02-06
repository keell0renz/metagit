import fs from 'fs'
import path from 'path'

interface Config {
    instructions?: string
    model?: string
}

const defaultConfig: Config = {
    instructions: '',
    model: 'gpt-4o-mini',
}

export const loadConfig = (external_path?: string): Config => {
    const configPath =
        external_path ?? path.resolve(process.cwd(), 'metagit.json')
    if (fs.existsSync(configPath)) {
        const fileConfig: Config = JSON.parse(
            fs.readFileSync(configPath, 'utf8')
        )
        return {
            instructions: fileConfig.instructions ?? defaultConfig.instructions,
            model: fileConfig.model ?? defaultConfig.model,
        }
    }
    return defaultConfig
}

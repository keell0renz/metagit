import OpenAI from 'openai'
import Groq from 'groq-sdk'
import { Config } from './config'
import { checkEnvVariable } from './utils'

const getGenerator = (provider: 'openai' | 'groq') => {
    if (provider === 'openai') {
        checkEnvVariable('OPENAI_API_KEY')

        return async (prompt: string, config: Config) => {
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            })
            const response = await openai.chat.completions.create({
                model: config.model,
                messages: [{ role: 'user', content: prompt }],
            })
            return response.choices[0]?.message?.content?.trim() || 'commit'
        }
    } else if (provider === 'groq') {
        checkEnvVariable('GROQ_API_KEY')

        return async (prompt: string, config: Config) => {
            const groq = new Groq({
                apiKey: process.env.GROQ_API_KEY,
            })
            const response = await groq.chat.completions.create({
                model: config.model,
                messages: [{ role: 'user', content: prompt }],
            })
            return response.choices[0]?.message?.content?.trim() || 'commit'
        }
    }

    throw new Error('Invalid provider! Currently OpenAI and Groq are supported.')
}

export const generateCommitMessage = async (
    diff: string,
    config: Config,
    userMessage?: string
): Promise<string> => {
    const prompt = `
    Your job is to write git commit messages based on the git diff, user's message (optional) and user's instructions.
    You are not in a chat with user, don't respond like you are in a dialogue. Just generate a commit message.
    Treat user's message as something to improve. Essentially, if user provides a message try to enhance it but not change meaning.
    If user provides a message, YOU MUST NOT ADD NEW MEANING, just take the user's message and make it better based on context.
    If there is no user message, come up with your own message, in strict accordance with instructions!
    If you see that some files were formatted without changing logic, assume they are formatted and just say format etc.
    Also, do not add any other text than the commit message, including quotes, markdown, etc.

    <diff>
    ${diff.slice(0, config.diff_character_limit)}
    </diff>

    <instructions>
    ${config.instructions}
    </instructions>

    <user_message>
    ${userMessage || 'No user message!'}
    </user_message>
    `

    const generator = getGenerator(config.provider)

    const response = await generator(prompt, config)

    return response
}

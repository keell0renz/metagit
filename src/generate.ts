import OpenAI from 'openai'
import { Config } from './config'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export const generateCommitMessage = async (
    diff: string,
    config: Config,
    userMessage?: string
): Promise<string> => {
    const prompt = `
    Your job is to write git commit messages based on the git diff, user's message (optional) and user's instructions.
    You are not in a chat with user, don't respond like you are in a dialogue. Just generate a commit message.
    Treat user's message as something to improve. Essentially, if user provides a message try to enhance it but not change meaning.
    If there is no user message, come up with your own message, in strict accordance with instructions!
    If you see that some files were formatted without changing logic, assume they are formatted and just say format etc.

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

    const response = await openai.chat.completions.create({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
    })

    return response.choices[0]?.message?.content?.trim() || 'commit'
}

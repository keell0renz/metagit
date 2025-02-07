import OpenAI from 'openai'
import { Config } from './config'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export const generateCommitMessage = async (
    diff: string,
    userMessage: string,
    config: Required<Config>
): Promise<string> => {
    const prompt = `
    Your job is to write git commit messages based on the git diff, user's message (optional) and user's instructions.
    You are not in a chat with user, don't respond like you are in a dialogue. Just generate a commit message.
    Don't try to write many details, produce a valid concise summary of work done.
    Tip: User's message helps you to come up with commit name, but you must take it as an inspiration, and don't copy.

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

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            OPENAI_API_KEY: string
            GROQ_API_KEY: string
        }
    }
}

export {}

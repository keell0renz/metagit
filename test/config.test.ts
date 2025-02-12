import fs from 'fs'
import path from 'path'
import { loadConfig } from '../src/config'
import { Config } from '../src/config'
jest.mock('fs')
jest.mock('path')

describe('loadConfig', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('returns default config when no file exists', () => {
        const mockExistsSync = jest.spyOn(fs, 'existsSync')
        mockExistsSync.mockReturnValue(false)

        const config = loadConfig()

        expect(config).toEqual({
            instructions: `Please be concise, general, and make message under 10 words. 
        Also try to write in past tense, like what is done.
        If there are many details which are not related to each other, produce very general messages.`,
            model: 'llama-3.1-8b-instant',
            diff_character_limit: 64000,
            provider: 'groq'
        })
    })

    test('loads and merges config from file', () => {
        const mockExistsSync = jest.spyOn(fs, 'existsSync')
        mockExistsSync.mockReturnValue(true)

        const mockReadFileSync = jest.spyOn(fs, 'readFileSync')
        mockReadFileSync.mockReturnValue(
            JSON.stringify({
                instructions: 'test instructions',
                model: 'different-model',
                diff_character_limit: 1000,
                provider: 'openai'
            })
        )

        const mockResolve = jest.spyOn(path, 'resolve')
        mockResolve.mockReturnValue('/fake/path/metagit.json')

        const config = loadConfig()

        expect(config).toEqual({
            instructions: 'test instructions',
            model: 'different-model',
            diff_character_limit: 1000,
            provider: 'openai'
        })
    })

    test('uses provided config path and merges with defaults', () => {
        const customPath = '/custom/path/config.json'
        const mockExistsSync = jest.spyOn(fs, 'existsSync')
        mockExistsSync.mockReturnValue(true)

        const mockReadFileSync = jest.spyOn(fs, 'readFileSync')
        mockReadFileSync.mockReturnValue(
            JSON.stringify({
                instructions: 'custom instructions',
            })
        )

        const config = loadConfig(customPath)

        expect(fs.existsSync).toHaveBeenCalledWith(customPath)
        expect(config).toEqual({
            instructions: 'custom instructions',
            model: 'llama-3.1-8b-instant',
            diff_character_limit: 64000,
            provider: 'groq'
        })
    })

    test('cli args override file and default config', () => {
        const mockExistsSync = jest.spyOn(fs, 'existsSync')
        mockExistsSync.mockReturnValue(true)

        const mockReadFileSync = jest.spyOn(fs, 'readFileSync')
        mockReadFileSync.mockReturnValue(
            JSON.stringify({
                instructions: 'file instructions',
                model: 'file-model',
                diff_character_limit: 1000,
                provider: 'openai'
            })
        )

        const cliArgs: Partial<Config> = {
            model: 'cli-model',
            diff_character_limit: 2000,
            provider: 'groq'
        }

        const config = loadConfig(undefined, cliArgs)

        expect(config).toEqual({
            instructions: 'file instructions',
            model: 'cli-model',
            diff_character_limit: 2000,
            provider: 'groq'
        })
    })
})

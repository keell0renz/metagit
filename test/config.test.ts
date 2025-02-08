import fs from 'fs'
import path from 'path'
import { loadConfig } from '../src/config'

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
            instructions: 'Please keep the message concise, modest and descriptive',
            model: 'gpt-4o-mini',
            diff_character_limit: 32000,
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
            })
        )

        const mockResolve = jest.spyOn(path, 'resolve')
        mockResolve.mockReturnValue('/fake/path/metagit.json')

        const config = loadConfig()

        expect(config).toEqual({
            instructions: 'test instructions',
            model: 'different-model',
            diff_character_limit: 1000,
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
            model: 'gpt-4o-mini',
            diff_character_limit: 32000,
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
            })
        )

        const cliArgs = {
            model: 'cli-model',
            diff_character_limit: 2000,
        }

        const config = loadConfig(undefined, cliArgs)

        expect(config).toEqual({
            instructions: 'file instructions',
            model: 'cli-model',
            diff_character_limit: 2000,
        })
    })
})

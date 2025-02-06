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
            instructions: '',
            model: 'gpt-4o-mini'
        })
    })

    test('loads and merges config from file', () => {
        const mockExistsSync = jest.spyOn(fs, 'existsSync')
        mockExistsSync.mockReturnValue(true)

        const mockReadFileSync = jest.spyOn(fs, 'readFileSync')
        mockReadFileSync.mockReturnValue(JSON.stringify({
            instructions: 'test instructions',
            model: 'different-model'
        }))

        const mockResolve = jest.spyOn(path, 'resolve')
        mockResolve.mockReturnValue('/fake/path/metagit.json')

        const config = loadConfig()

        expect(config).toEqual({
            instructions: 'test instructions',
            model: 'different-model'
        })
    })

    test('uses provided config path', () => {
        const customPath = '/custom/path/config.json'
        const mockExistsSync = jest.spyOn(fs, 'existsSync')
        mockExistsSync.mockReturnValue(true)

        const mockReadFileSync = jest.spyOn(fs, 'readFileSync')
        mockReadFileSync.mockReturnValue(JSON.stringify({
            instructions: 'custom instructions'
        }))

        const config = loadConfig(customPath)

        expect(fs.existsSync).toHaveBeenCalledWith(customPath)
        expect(config).toEqual({
            instructions: 'custom instructions',
            model: 'gpt-4o-mini'
        })
    })
})

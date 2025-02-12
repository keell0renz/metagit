import { execSync } from 'child_process'
import { checkGitRepository, filterLockFiles, makeCommit, checkEnvVariable } from '../src/utils'

jest.mock('child_process')

describe('utils', () => {
    describe('checkGitRepository', () => {
        it('should return true when in git repository', () => {
            const mockExecSync = execSync as jest.MockedFunction<typeof execSync>
            mockExecSync.mockReturnValue('true')

            expect(checkGitRepository()).toBe(true)
            expect(mockExecSync).toHaveBeenCalledWith('git rev-parse --is-inside-work-tree', {
                encoding: 'utf-8',
            })
        })

        it('should return false when not in git repository', () => {
            const mockExecSync = execSync as jest.MockedFunction<typeof execSync>
            mockExecSync.mockImplementation(() => {
                throw new Error('Not a git repository')
            })

            expect(checkGitRepository()).toBe(false)
        })
    })

    describe('filterLockFiles', () => {
        it('should filter out lock file changes', () => {
            const diff =
                'diff --git a/package-lock.json b/package-lock.json\nsome changes\ndiff --git a/src/index.ts b/src/index.ts\nactual changes'

            const result = filterLockFiles(diff)
            expect(result).toBe('diff --git a/src/index.ts b/src/index.ts\nactual changes')
        })

        it('should handle multiple lock files', () => {
            const diff =
                'diff --git a/yarn.lock b/yarn.lock\nlock changes\ndiff --git a/src/file1.ts b/src/file1.ts\nchanges1\ndiff --git a/pnpm-lock.yaml b/pnpm-lock.yaml\nmore lock changes\ndiff --git a/src/file2.ts b/src/file2.ts\nchanges2'

            const result = filterLockFiles(diff)
            expect(result).toBe(
                'diff --git a/src/file1.ts b/src/file1.ts\nchanges1\ndiff --git a/src/file2.ts b/src/file2.ts\nchanges2'
            )
        })
    })

    describe('checkEnvVariable', () => {
        const originalEnv = process.env
        const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never)
        const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

        beforeEach(() => {
            process.env = { ...originalEnv }
        })

        afterEach(() => {
            process.env = originalEnv
            jest.clearAllMocks()
        })

        it('should not exit when environment variable exists', () => {
            process.env.TEST_VAR = 'exists'

            checkEnvVariable('TEST_VAR')

            expect(mockExit).not.toHaveBeenCalled()
            expect(mockConsoleError).not.toHaveBeenCalled()
        })

        it('should exit with error when environment variable is not set', () => {
            delete process.env.TEST_VAR

            checkEnvVariable('TEST_VAR')

            expect(mockConsoleError).toHaveBeenCalledWith('Environment variable TEST_VAR is not set!')
            expect(mockExit).toHaveBeenCalledWith(1)
        })
    })
})

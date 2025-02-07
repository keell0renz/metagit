import { execSync } from 'child_process'
import { checkGitRepository, filterLockFiles, makeCommit } from '../src/utils'

jest.mock('child_process')

describe('utils', () => {
    describe('checkGitRepository', () => {
        it('should return true when in git repository', () => {
            const mockExecSync = execSync as jest.MockedFunction<
                typeof execSync
            >
            mockExecSync.mockReturnValue('true')

            expect(checkGitRepository()).toBe(true)
            expect(mockExecSync).toHaveBeenCalledWith(
                'git rev-parse --is-inside-work-tree',
                {
                    encoding: 'utf-8',
                }
            )
        })

        it('should return false when not in git repository', () => {
            const mockExecSync = execSync as jest.MockedFunction<
                typeof execSync
            >
            mockExecSync.mockImplementation(() => {
                throw new Error('Not a git repository')
            })

            expect(checkGitRepository()).toBe(false)
        })
    })

    describe('filterLockFiles', () => {
        it('should filter out lock file changes', () => {
            const diff = `diff --git a/package-lock.json b/package-lock.json
                        some changes
                        diff --git a/src/index.ts b/src/index.ts
                        actual changes`

            const result = filterLockFiles(diff)
            expect(result).toBe(
                'diff --git a/src/index.ts b/src/index.ts\nactual changes'
            )
        })

        it('should handle multiple lock files', () => {
            const diff = `diff --git a/yarn.lock b/yarn.lock
                        lock changes
                        diff --git a/src/file1.ts b/src/file1.ts
                        changes1
                        diff --git a/pnpm-lock.yaml b/pnpm-lock.yaml
                        more lock changes
                        diff --git a/src/file2.ts b/src/file2.ts
                        changes2`

            const result = filterLockFiles(diff)
            expect(result).toBe(
                'diff --git a/src/file1.ts b/src/file1.ts\nchanges1\ndiff --git a/src/file2.ts b/src/file2.ts\nchanges2'
            )
        })
    })
})

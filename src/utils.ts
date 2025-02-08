import { execSync } from 'child_process'

export const checkGitRepository = (): boolean => {
    try {
        const output = execSync('git rev-parse --is-inside-work-tree', {
            encoding: 'utf-8',
        })
        return output.trim() === 'true'
    } catch (err) {
        return false
    }
}

export const filterLockFiles = (diff: string): string => {
    const lines = diff.split('\n')
    let isLockFile = false
    const filteredLines = lines
        .filter((line) => {
            const trimmedLine = line.trim()
            if (trimmedLine.match(/^diff --git a\/(.*\/)?(yarn\.lock|pnpm-lock\.yaml|package-lock\.json)/)) {
                isLockFile = true
                return false
            }
            if (trimmedLine.startsWith('diff --git')) {
                isLockFile = false
                return true
            }
            return !isLockFile
        })
        .map((line) => line.trim())
    return filteredLines.join('\n')
}

export const makeCommit = (input: string): void => {
    execSync(`git commit -F -`, { input: input.trim() })
}

export const getDiff = (): string => {
    const orig_diff = execSync('git diff --staged').toString()
    const filtered_diff = filterLockFiles(orig_diff)

    if (orig_diff != filtered_diff) {
        console.log(
            "Changes detected in lock files. These changes will be included in the commit but won't be analyzed for commit message generation."
        )
    }

    return filtered_diff
}

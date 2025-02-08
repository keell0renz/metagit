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

export const filterLockFiles = (diff: string) => {
    const lines = diff.split('\n')
    let isLockFile = false
    const filteredLines = lines.filter((line) => {
        if (line.match(/^diff --git a\/(.*\/)?(yarn\.lock|pnpm-lock\.yaml|package-lock\.json)/)) {
            isLockFile = true
            return false
        }
        if (isLockFile && line.startsWith('diff --git')) {
            isLockFile = false
        }
        return !isLockFile
    })
    return filteredLines.join('\n')
}

export const makeCommit = (input: string): void => {
    execSync('git commit -m ' + JSON.stringify(input.trim()))
}

export const getDiff = (): string => {
    const orig_diff = execSync('git diff --staged').toString()
    const filtered_diff = filterLockFiles(orig_diff)

    if (orig_diff != filtered_diff) {
        console.log(
            "Changes detected in lock files. These changes will be included in the commit but won't be analyzed for commit message generation."
        )
    }

    if (!filtered_diff.trim()) {
        console.log('No changes to commit! Maybe you forgot to git add .?')
        process.exit(1)
    }

    return filtered_diff
}

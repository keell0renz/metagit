#!/usr/bin/env node
// For compiled javascript file'

import { Command } from 'commander'
import { checkGitRepository, getDiff, makeCommit } from './utils'
import { loadConfig } from './config'
import { generateCommitMessage } from './generate'
import inquirer from 'inquirer'

process.removeAllListeners('warning')

const program = new Command()

program
    .name('metagit')
    .description('MetaGit is a program which automates git commit naming with AI.')
    .version('0.0.4')

program
    .argument('[userMessage...]', "Optional user's message which describes commit.")
    .option('--instructions <instructions>', 'Commit message generation instructions to AI.')
    .option('--model <model>', 'OpenAI or Groq model to use. Note: Model must match provider!')
    .option('--provider <provider>', 'Provider: OpenAI or Groq.', 'groq')
    .option('--diff_character_limit <number>', 'Character limit of git diff.', (value) => parseInt(value, 10))

    .action(async (args, options) => {
        const userMessage = args.join(' ')

        const config = loadConfig(undefined, options)

        if (!checkGitRepository()) {
            console.error('This is not a git repository!')
            process.exit(1)
        }

        const diff = getDiff()

        const message = await generateCommitMessage(diff, config, userMessage)

        console.log(message)

        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Do you want to proceed with this commit message?',
                default: true,
            },
        ])

        if (confirm) {
            makeCommit(message)
            console.log('Commit created successfully!')
        } else {
            console.log('Commit cancelled.')
            process.exit(0)
        }
    })

program.parse(process.argv)

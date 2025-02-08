#!/usr/bin/env node
// For compiled javascript file'

import { Command } from 'commander'

process.removeAllListeners('warning')

const program = new Command()

program
    .name('metagit')
    .description('MetaGit is a program which automates git commit naming with AI.')
    .version('0.0.1')

program
    .argument('[userMessage', "Optional user's message which describes commit.")
    .option('--instructions <instructions>', 'Commit message generation instructions to AI.')
    .option('--model <model>', 'OpenAI model to use.')
    .option('--diff_character_limit <number>', 'Character limit of git diff.', (value) => parseInt(value, 10))
    .action((command, options) => {
        console.log(command)
        console.log(options)
    })

program.parse(process.argv)

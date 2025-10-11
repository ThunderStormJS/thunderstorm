#!/usr/bin/env node

import pc from 'picocolors'

import { print, warn, error, emojii, printHeading } from './helpers.js'

import build from './build.js'
import start from './start.js'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('../package.json')
const core = require('../core/package.json')

printHeading()

//////////////////////////////
////////// COMMANDS //////////
//////////////////////////////

const [, , command, ...args] = process.argv

if (['-v', '--version'].includes(command)) {
    //console.log(pkg)
    print(`    Current version:
      command: ${pc.whiteBright(`${pkg.name}`)} ${pc.magentaBright(`v${pkg.version}`)} ${pc.gray(pkg.keywords[0])}
      library: ${pc.whiteBright(`${core.name}`)} ${pc.magentaBright(`v${core.version}`)} ${pc.gray(core.keywords[0])}`)
    process.exit(0)
}

if (!command || ['-h', '--help'].includes(command)) {
    print(`    Available commands:
      ${pc.cyanBright('ts create <name>')}   Create a new project
      ${pc.cyanBright('ts build')}           Build the project
      ${pc.cyanBright('ts start')}           Start dev server
      ${pc.cyanBright('ts upgrade')}         Upgrade dependencies`)
    process.exit(0)
}

switch (command) {
    case 'create':
        await createCommand()
        break
    case 'build':
        await buildCommand()
        break
    case 'start':
        await startCommand()
        break
    case 'upgrade':
        await upgradeCommand()
        break
    default:
        error(`[ ${emojii.cross} ] Unknown command: ${pc.yellow(command)}`)
        print(`Available commands: ${pc.cyanBright('create <name>, build, start, upgrade')}`)
}

async function createCommand() {
    const projectName = args[0] || ''

    if (!projectName) {
        const cmd = pc.gray('ts create')
        const prj = pc.cyanBright('<project-name>')
        print(`[ ${emojii.cross} ] project name is required: ${cmd} ${prj}`)
        return
    }

    print(`[ ${emojii.tick} ] creating project: ${pc.cyanBright(projectName)}`)
    // do the things here...
    print(`[ ${emojii.tick} ] done`)
}

async function buildCommand() {
    await build()
}
async function startCommand() {
    await start()
}

async function upgradeCommand() {
    print(`[ ${emojii.tick} ] upgrading project`)
    // do the things here:
    print(`[ ${emojii.tick} ] done`)
}

//////////////////////////////
////////// COMMANDS //////////
//////////////////////////////

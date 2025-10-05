import isUnicodeSupported from 'is-unicode-supported'
import pc from 'picocolors'

export const emojii = {
    tick: pc.greenBright(`✔`),
    cross: pc.redBright(`✖`),
    bolt: `⚡`,
    warn: `⚠️`,
}

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('../package.json')

export function printHeading() {
    console.clear()
    print(` ⚡ ${pc.whiteBright(`ThunderStormJS`)} v${pkg.version} ⚡`)
}

// ---------------------------
//  CONSOLE OUTPUT WRAPPERS
// ---------------------------

export function print(msg) {
    console.log(sanitizeOutput(msg))
}
export function warn(msg) {
    console.warn(sanitizeOutput(msg))
}
export function error(msg) {
    console.error(sanitizeOutput(msg))
}

// ---------------------------
//  HELPER FUNCTIONS
// ---------------------------

function sanitizeOutput(msg) {
    if (isUnicodeSupported()) return msg

    // map of fancy chars → ASCII fallbacks
    const replacements = {
        '⚡': '*',
        '✔': '[OK]',
        '✖': '[X]',
        '→': '->',
        '•': '-',
    }

    return msg.replace(/⚡|✔|✖|→|•/g, (ch) => replacements[ch] || ch)
}

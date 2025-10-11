import { mkdirSync, readdirSync, statSync, writeFileSync, copyFileSync } from 'fs'
import { join, resolve } from 'path'

import fs from 'fs'
import path from 'path'
import esbuild from 'esbuild'
import pc from 'picocolors'
import parse from './parser.js'

import { print, warn, error, emojii } from './helpers.js'

export { build as default }

async function build() {
    const entry = path.resolve('index.tsx')

    if (!fs.existsSync(entry)) {
        warn(`[ ${emojii.cross} ] no input file found at ${pc.yellow('index.tsx')}`)
        return
    }

    // build with esbuild (in-memory)
    const result = await esbuild.build({
        entryPoints: [entry],
        bundle: true,
        write: false,
        jsx: 'transform',
        loader: { '.tsx': 'tsx' },
        format: 'esm',
        platform: 'browser',
        sourcemap: false,
    })

    const bundled = result.outputFiles[0].text

    // inject bundle into HTML
    const output = parse(bundled)

    const outPath = path.resolve('dist/index.html')
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
    fs.writeFileSync(outPath, output)

    await buildThemes()

    print(`[ ${emojii.tick} ] build complete → ${pc.cyanBright(outPath)}`)
}

/*
export async function buildThemes() {
    const THEMES_DIR = resolve('./theme')
    const DIST_DIR = resolve('./dist/theme')

    mkdirSync(DIST_DIR, { recursive: true })

    // read all subdirectories in ./theme
    const themeDirs = readdirSync(THEMES_DIR).filter((name) => {
        const fullPath = join(THEMES_DIR, name)
        return statSync(fullPath).isDirectory()
    })

    for (const themeName of themeDirs) {
        const srcDir = join(THEMES_DIR, themeName)
        const destDir = join(DIST_DIR, themeName)
        mkdirSync(destDir, { recursive: true })

        const files = []
        const walk = (dir, base = '') => {
            for (const entry of readdirSync(dir)) {
                const full = join(dir, entry)
                const rel = base ? `${base}/${entry}` : entry
                const stat = statSync(full)
                if (stat.isDirectory()) {
                    walk(full, rel)
                } else if (/\.(css|png|jpg|jpeg|webp|svg|gif|ico)$/i.test(entry)) {
                    files.push(rel)
                    const destPath = join(destDir, rel)
                    mkdirSync(join(destPath, '..'), { recursive: true })
                    copyFileSync(full, destPath)
                }
            }
        }

        // walk the `./theme` directory
        // - this copies files into the `./dist` directory
        // - and prepare the `manifest.json` file(s)
        walk(srcDir)
        const manifestPath = join(destDir, 'manifest.json')
        writeFileSync(manifestPath, JSON.stringify({ name: themeName, files }, null, 2))
        print(`[ ${emojii.tick} ] theme added → ${pc.whiteBright(themeName)} (${files.length} files)`)
    }
}
*/

export async function buildThemes() {
    const THEMES_DIR = resolve('./theme')
    const DIST_DIR = resolve('./dist/theme')
  
    mkdirSync(DIST_DIR, { recursive: true })
  
    // read all subdirectories in ./theme
    const themeDirs = readdirSync(THEMES_DIR).filter((name) => {
      const fullPath = join(THEMES_DIR, name)
      return statSync(fullPath).isDirectory()
    })
  
    for (const themeName of themeDirs) {
      const srcDir = join(THEMES_DIR, themeName)
      const destDir = join(DIST_DIR, themeName)
      mkdirSync(destDir, { recursive: true })
  
      const files = []
      const walk = (dir, base = '') => {
        for (const entry of readdirSync(dir)) {
          const full = join(dir, entry)
          const rel = base ? `${base}/${entry}` : entry
          const stat = statSync(full)
          if (stat.isDirectory()) {
            walk(full, rel)
          } else if (/\.(css|png|jpg|jpeg|webp|svg|gif|ico)$/i.test(entry)) {
            files.push(rel)
            const destPath = join(destDir, rel)
            mkdirSync(join(destPath, '..'), { recursive: true })
            copyFileSync(full, destPath)
          }
        }
      }
  
      // walk the `./theme/<themeName>` directory and copy files
      walk(srcDir)
  
      // create manifest.json for each theme
      const manifestPath = join(destDir, 'manifest.json')
      writeFileSync(manifestPath, JSON.stringify({ name: themeName, files }, null, 2))
  
      print(`[ ${emojii.tick} ] theme added → ${pc.whiteBright(themeName)} (${files.length} files)`)
    }
  
    // ✅ Write the global themes.json file
    const themesJsonPath = join(THEMES_DIR, 'themes.json')
    const distJsonPath = join(DIST_DIR, 'themes.json')
    const themesJson = { themes: themeDirs }

    writeFileSync(themesJsonPath, JSON.stringify(themesJson, null, 2))
    writeFileSync(distJsonPath, JSON.stringify(themesJson, null, 2))
  
    print(`[ ${emojii.tick} ] themes.json created → ${pc.cyan(themesJsonPath)}`)
  }
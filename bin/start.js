import http from 'http'
import fs from 'fs'
import { glob } from 'glob'
import path from 'path'
import open from 'open'
import pc from 'picocolors'
import chokidar from 'chokidar'
import { WebSocketServer } from 'ws'

// libs
import { print, warn, error, emojii, printHeading } from './helpers.js'
import build from './build.js'

const debugging = false

export { start as default }

async function start() {
    await build()
    const port = 8787
    const server = http.createServer((req, res) => {
        let filePath = path.join('dist', req.url === '/' ? 'index.html' : req.url)
        if (!fs.existsSync(filePath)) {
            res.writeHead(404)
            return res.end('Not Found')
        }
        res.writeHead(200)
        res.end(fs.readFileSync(filePath))
    })

    const wss = new WebSocketServer({ server })
    function reload() {
        for (const client of wss.clients) {
            if (client.readyState === 1) client.send('reload')
        }
    }

    // Define which file extensions you want to watch
    const exts = ['tsx', 'ts', 'js', 'css', 'html']

    const ignore = ['node_modules', 'dist', '.git']

    // Create glob patterns for all files under current folder
    const ignorePaths = ignore.map((d) => `${d}/**/*`)
    const watchPaths = glob.sync(
        exts.map((e) => `**/*.{${exts.join(',')}}`),
        { ignore: ignorePaths }
    )

    if (debugging) {
        console.log({
            cwd: path.resolve(process.cwd()),
            watchPaths,
            ignorePaths,
        })
    }

    // Initialize watcher
    const watcher = chokidar.watch(watchPaths, {
        cwd: path.resolve(process.cwd()),
        ignored: /node_modules|dist|\.git/,
        persistent: true,
        ignoreInitial: true,
        //usePolling: true,
        //interval: 600,
    })

    // Watch for changes and trigger a rebuild
    watcher.on('all', async (event, path) => {
        if (['add', 'change', 'unlink'].includes(event)) {
            printHeading()
            print(`[ ${emojii.tick} ] changes detected → rebuilding...`)
            try {
                await build()
                const url = `http://localhost:${port}`
                print(`[ ${emojii.tick} ] running at → ${pc.cyanBright(url)}`)
                reload()
            } catch (err) {
                error(`[ ${emojii.warn} ] failed to rebuild:\n`, err)
            }
        }
    })

    /*
    chokidar.watch('index.tsx').on('change', async () => {
        printHeading()
        print(`[ ${emojii.tick} ] change detected → rebuilding...`)
        await build()
        const url = `http://localhost:${port}`
        print(`[ ${emojii.tick} ] running at → ${pc.cyanBright(url)}`)
        reload()
    })
    */

    server.listen(port, () => {
        const url = `http://localhost:${port}`
        print(`[ ${emojii.tick} ] running at → ${pc.cyanBright(url)}`)
        open(url) // auto-open browser
    })
}

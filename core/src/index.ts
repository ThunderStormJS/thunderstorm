import { addElement } from './dom'

export { ThunderStorm as default }

class ThunderStorm {
    options: ThemeOptions = {
        animations: true,
        mode: 'light',
    }

    constructor() {}

    Theme = {
        Settings: (opts: Partial<ThemeOptions>) => {
            this.options.animations = !!opts.animations
            this.options.mode = opts.mode === 'dark' ? 'dark' : 'light'
        },

        Load: async (name: string, opts?: ThemeOptions) => {
            if (opts) this.Theme.Settings(opts)

            // remove previously loaded theme assets
            document.querySelectorAll('link[data-theme], style[data-theme]').forEach((el) => el.remove())

            const themePath = `./theme/${name}/`
            try {
                // dynamically fetch the file list
                // NOTE: this works if you have a bundler or dev server that exposes the theme directory,
                // or you can hardcode CSS files for static builds
                const response = await fetch(`${themePath}manifest.json`).catch(() => null)

                let files: string[] = []

                if (response && response.ok) {
                    const data = await response.json()
                    files = data.files || []
                } else {
                    // fallback: find .css files by convention
                    files = [`theme.css`, `main.css`]
                }

                for (const file of files) {
                    if (file.endsWith('.css')) {
                        const link = document.createElement('link')
                        link.rel = 'stylesheet'
                        link.href = `${themePath}${file}`
                        link.dataset.theme = name
                        document.head.appendChild(link)
                    } else if (/\.(png|jpg|jpeg|webp|svg|gif)$/i.test(file)) {
                        // preload images (optional)
                        const img = new Image()
                        img.src = `${themePath}${file}`
                    }
                }

                console.log(`⚡ Loaded theme → ${name}`)
            } catch (err) {
                console.error(`⚠️ Failed to load theme → '${name}':`, err)
            }
        },
    }

    Body = {
        Main: (elements: (HTMLElement | string)[] = []) => addElement('main')(elements),
        Header: (elements: (HTMLElement | string)[] = []) => addElement('header')(elements),
        Footer: (elements: (HTMLElement | string)[] = []) => addElement('footer')(elements),
    }

    Menu = {
        Top: (elements: (HTMLElement | string)[] = []) => addElement('top')(elements),
        Side: (elements: (HTMLElement | string)[] = []) => addElement('side')(elements),
    }

    $$(q: string = '') {
        return {
            css: () => {},
        }
    }
}

type ThemeOptions = {
    animations: boolean
    mode: 'light' | 'dark'
}

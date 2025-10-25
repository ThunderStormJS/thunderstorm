import { addElement } from './dom'

export { ThunderStorm as default }

class ThunderStorm {
    _theme: ThemeOptions = {
        animations: true,
        mode: 'light',
        icon: {
            svg: '',
            src: '',
            emoji: '⚡',
        },
    }

    constructor() {}

    Theme = {
        Settings: (opts: Partial<ThemeOptions>) => {
            this._theme.animations = !!opts.animations
            this._theme.mode = opts.mode === 'dark' ? 'dark' : 'light'
        },

        List: async () => {
            const pattern = '**/*'
            const themesFile = `./theme/themes.json`
            try {
                const response = await fetch(themesFile).catch(() => null)

                let themes: string[] = []

                if (response && response.ok) {
                    const data = await response.json()
                    themes = data.themes || []
                }

                console.log(`⚡ Available themes → ${themes.join(`,`)}`)
                return themes
            } catch (err) {
                console.error(`⚠️ Failed to load themes.json`, err)
            }
        },

        Icon: (opts: Partial<IconOptions>) => {},

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
                const available = `(files: ${files.join(',')})`
                console.log(`⚡ Loaded theme → ${name} ${available}`)
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
    icon: IconOptions
}

type IconOptions = {
    svg: string
    src: string
    emoji: Emoji
}
type Emoji =
    | '⚡'
    | '⛈️'
    | '👽'
    | '🤖'
    | '🧟'
    | '👻'
    | '💀'
    | '🙂'
    | '😉'
    | '🤣'
    | '😎'
    | '🐾'
    | '😺'
    | '🐵'
    | '🐕'
    | '🐺'
    | '🦊'
    | '🦝'
    | '🦁'
    | '🐯'
    | '🦓'
    | '🦄'
    | '🐮'
    | '🐷'
    | '🐭'
    | '🐹'
    | '🐰'
    | '🦇'
    | '🐻'
    | '🐨'
    | '🦘'
    | '🐼'
    | '🐔'
    | '🐓'
    | '🦃'
    | '🐥'
    | '🐦'
    | '🐧'
    | '🦅'
    | '🦆'
    | '🦢'
    | '🦉'
    | '🦩'
    | '🦚'
    | '🦜'
    | '🐸'
    | '🐊'
    | '🐢'
    | '🦎'
    | '🐍'
    | '🐲'
    | '🐉'
    | '🐋'
    | '🐬'
    | '🐟'
    | '🐠'
    | '🐡'
    | '🦈'
    | '🐙'
    | '🐚'
    | '🦀'
    | '🦞'
    | '🦐'
    | '🦑'
    | '🦪'
    | '🐌'
    | '🦋'
    | '🐛'
    | '🐜'
    | '🐝'
    | '🐞'
    | '🦗'
    | '🦂'
    | '🦟'
    | '🦠'
    | '🌸'
    | '🌹'
    | '🥀'
    | '🌺'
    | '🌻'
    | '🌼'
    | '🌷'
    | '🌱'
    | '🌲'
    | '🌳'
    | '🌴'
    | '🌵'
    | '🌾'
    | '🌿'
    | '🍀'
    | '🍁'
    | '🍂'
    | '🍄'
    | '🍇'
    | '🍉'
    | '🍊'
    | '🍋'
    | '🍌'
    | '🍍'
    | '🥭'
    | '🍎'
    | '🍏'
    | '🍐'
    | '🍑'
    | '🍒'
    | '🍓'
    | '🥝'
    | '🍅'
    | '🥥'
    | '🥑'
    | '🍆'
    | '🥔'
    | '🥕'
    | '🌽'
    | '🥒'
    | '🥬'
    | '🧄'
    | '🧅'
    | '🥜'
    | '🌰'
    | '🍞'
    | '🥐'
    | '🥖'
    | '🥨'
    | '🥯'
    | '🥞'
    | '🧇'
    | '🧀'
    | '🍗'
    | '🥩'
    | '🥓'
    | '🍔'
    | '🍟'
    | '🍕'
    | '🌭'
    | '🥪'
    | '🌮'
    | '🌯'
    | '🥙'
    | '🧆'
    | '🥚'
    | '🍳'
    | '🍲'
    | '🥣'
    | '🥗'
    | '🍿'
    | '🧈'
    | '🧂'
    | '🥫'
    | '🍱'
    | '🍚'
    | '🍜'
    | '🍣'
    | '🍥'
    | '🥮'
    | '🥠'
    | '🥡'
    | '🍦'
    | '🍧'
    | '🍩'
    | '🍪'
    | '🎂'
    | '🧁'
    | '🥧'
    | '🍭'
    | '🍯'
    | '🍼'
    | '☕'
    | '🍷'
    | '🍸'
    | '🍹'
    | '🍺'
    | '🥃'
    | '🧃'
    | '🧊'
    | '🌍'
    | '🌎'
    | '🌏'
    | '🧭'
    | '🏢'
    | '🏠'
    | '🏡'
    | '🏰'
    | '🎪'
    | '💈'
    | '💘'
    | '💔'
    | '💋'
    | '💫'
    | '💦'
    | '💥'
    | '💤'
    | '👋'
    | '🖖'
    | '👍'
    | '👎'
    | '✊'
    | '👊'
    | '🧠'
    | '🦷'
    | '🦴'
    | '👀'
    | '👅'
    | '👄'

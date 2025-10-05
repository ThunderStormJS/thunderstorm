export { JSX as default }
export { Fragment }
export { h }

function JSX<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    props: DOMProps<HTMLElementTagNameMap[K]> | null,
    ...children: any[]
): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag) as HTMLElementTagNameMap[K]

    if (props) {
        for (const [key, value] of Object.entries(props)) {
            if (key.startsWith('on') && typeof value === 'function') {
                // turn "onClick" → "click"
                const eventName = key.slice(2).toLowerCase() as keyof HTMLElementEventMap
                el.addEventListener(eventName, value as EventListener)
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(el.style, value)
            } else if (key !== 'children') {
                el.setAttribute(key, String(value))
            }
        }
    }

    for (const child of children) {
        if (typeof child === 'string') {
            el.appendChild(document.createTextNode(child))
        } else if (child instanceof Node) {
            el.appendChild(child)
        }
    }

    return el
}

const h = JSX

function Fragment(props: { children?: any[] }) {
    const fragment = document.createDocumentFragment()

    if (props.children) {
        for (const child of props.children) {
            if (typeof child === 'string') {
                fragment.appendChild(document.createTextNode(child))
            } else if (child instanceof Node) {
                fragment.appendChild(child)
            }
        }
    }

    return fragment
}

// @thunderstormjs/core/jsx/jsx-runtime.ts
//export { h, h as jsx, h as jsxs, Fragment } from './factory'

export function jsx(tag: any, props: any, key?: any): HTMLElement {
    if (typeof tag === 'function') {
        // support function components
        return tag(props)
    }

    // create element
    const el = document.createElement(tag)

    // set props
    for (const [name, value] of Object.entries(props || {})) {
        if (name === 'children') {
            appendChildren(el, value)
        } else if (name === 'style' && typeof value === 'object') {
            Object.assign(el.style, value)
        } else if (name.startsWith('on') && typeof value === 'function') {
            el.addEventListener(name.slice(2).toLowerCase(), value)
        } else {
            el.setAttribute(name, String(value))
        }
    }

    return el
}

export const jsxs = jsx // same logic for multiple children
export const Fragment = (props: { children?: any }) => {
    const f = document.createDocumentFragment()
    appendChildren(f, props.children)
    return f
}

function appendChildren(parent: Node, children: any) {
    if (children == null) return
    if (Array.isArray(children)) {
        for (const child of children) appendChildren(parent, child)
    } else if (typeof children === 'string' || typeof children === 'number') {
        parent.appendChild(document.createTextNode(String(children)))
    } else {
        parent.appendChild(children)
    }
}

export {}

declare global {
    type EventProps<T extends HTMLElement> = {
        [K in keyof HTMLElementEventMap as `on${Capitalize<K>}`]?: (ev: HTMLElementEventMap[K]) => any
    }

    type DOMProps<T extends HTMLElement = HTMLElement> = Partial<
        EventProps<T> & {
            id?: string
            class?: string
            style?: string | Partial<CSSStyleDeclaration>
            children?: any
            [key: string]: any
        }
    >

    type IntrinsicElementProps = {
        [K in keyof HTMLElementTagNameMap]: DOMProps<HTMLElementTagNameMap[K]>
    }

    namespace JSX {
        type Element = HTMLElement | DocumentFragment

        interface ElementChildrenAttribute {
            children: {}
        }

        interface IntrinsicElements extends IntrinsicElementProps {}
    }
}

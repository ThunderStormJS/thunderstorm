export {}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            div: any
            span: any
            h1: any
            // … add more HTML tags or make it generic
            [elemName: string]: any
        }
    }
}

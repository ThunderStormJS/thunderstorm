export function addElement(id: string) {
    if (!id) return

    // Define your desired section order globally or within this module
    const order = ['top', 'side', 'header', 'main', 'footer']

    return (elements: (HTMLElement | string)[]) => {
        let element = document.getElementById(id)

        if (!element) {
            element = document.createElement('div')
            element.id = id

            // Find where this element should be inserted
            const index = order.indexOf(id)
            if (index === -1) {
                // Not part of ordered layout, just append at end
                document.body.appendChild(element)
            } else {
                // Find the next element in order that already exists
                let inserted = false
                for (let i = index + 1; i < order.length; i++) {
                    const next = document.getElementById(order[i])
                    if (next) {
                        document.body.insertBefore(element, next)
                        inserted = true
                        break
                    }
                }
                if (!inserted) {
                    // If none of the later ones exist yet, append at end
                    document.body.appendChild(element)
                }
            }
        }

        // Clear previous contents
        element.innerHTML = ''

        // Append each element (maintain their array order)
        for (const el of elements) {
            element.appendChild(typeof el === 'string' ? document.createTextNode(el) : el)
        }
    }
}

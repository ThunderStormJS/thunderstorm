import ThunderStorm from '@thunderstormjs/core'

import { HelloWorld } from './elements'

// construct the DOM elements
const { Menu, Body, Theme } = new ThunderStorm()

Theme.Settings({
    animations: false,
})

Theme.List()
Theme.Load('default')

Menu.Top()
Menu.Side()

const hello = await HelloWorld()
const second = <h2>⚡ H2 Heading ⚡</h2>

Body.Header([<div style="background:red; color:white;">⚡ Header ⚡</div>]) // use an inline element
Body.Main([hello, second]) // use an imported function
Body.Footer([<div style="background:blue;color:white;">⚡ Footer ⚡</div>]) // use an inline element

// log to the console
console.log('⚡ Hello, World! ⚡') 

setTimeout(async () => {
    Body.Main([<h1>⚡ Let's make some thunder!! ⚡</h1>])
    Theme.Load('turtle') // use themes.json
}, 5000)

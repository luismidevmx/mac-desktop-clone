import 'normalize.css'
import './app.css'
import './ui/native-components.less'

import { mount } from 'svelte'

import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!
})

export default app

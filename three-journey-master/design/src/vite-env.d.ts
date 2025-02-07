/// <reference types="vite/client" />

import type Router from './plugins/Router'

declare global {
  interface Window {
    $router: Router
  }
}

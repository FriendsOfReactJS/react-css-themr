import { jsdom } from 'jsdom'
/* eslint-disable no-unused-vars */
import raf from './tempPolyfills'


global.document = jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView
global.navigator = global.window.navigator

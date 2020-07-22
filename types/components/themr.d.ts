/**
 * Merges passed themes by concatenating string keys and processing nested themes
 *
 * @param {...TReactCSSThemrTheme} themes - Themes
 * @returns {TReactCSSThemrTheme} - Resulting theme
 */
export function themeable(...themes: TReactCSSThemrTheme[]): any;
export default themr;
export type TReactCSSThemrTheme = any;
export type TReactCSSThemrOptions = {};
/**
 * Themr decorator
 * @param {String|Number|Symbol} componentName - Component name
 * @param {TReactCSSThemrTheme} [localTheme] - Base theme
 * @param {{}} [options] - Themr options
 * @returns {function(ThemedComponent:Function):Function} - ThemedComponent
 */
declare function themr(componentName: string | number | Symbol, localTheme?: any, options?: {}): (arg0: any, arg1: Function) => Function;

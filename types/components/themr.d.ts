/**
 * Merges passed themes by concatenating string keys and processing nested themes
 *
 * @param {...TReactCSSThemrTheme} themes - Themes
 * @returns {TReactCSSThemrTheme} - Resulting theme
 */
export function themeable(...themes: TReactCSSThemrTheme[]): any;
export type TReactCSSThemrTheme = any;
export type TReactCSSThemrOptions = {};
export default function themr(componentName: string | number | Symbol, localTheme?: any, options?: {}): (arg0: any, arg1: Function) => Function;

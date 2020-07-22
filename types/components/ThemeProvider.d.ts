export default class ThemeProvider extends Component<any, any, any> {
    static propTypes: {
        children: any;
        theme: any;
    };
    static defaultProps: {
        theme: {};
    };
    static childContextTypes: {
        themr: any;
    };
    constructor(props: Readonly<any>);
    constructor(props: any, context?: any);
    getChildContext(): {
        themr: {
            theme: any;
        };
    };
}
import { Component } from "react";

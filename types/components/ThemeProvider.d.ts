export default class ThemeProvider extends Component<any, any, any> {
    static propTypes: {
        children: PropTypes.Validator<PropTypes.ReactElementLike>;
        theme: PropTypes.Validator<object>;
    };
    static defaultProps: {
        theme: {};
    };
    static childContextTypes: {
        themr: PropTypes.Validator<PropTypes.InferProps<{
            theme: PropTypes.Validator<object>;
        }>>;
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
import PropTypes from "prop-types";

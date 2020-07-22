import React, { Children, Component } from 'react'
import PropTypes from 'prop-types'
import { JSDOM } from 'jsdom'
import TestUtils from 'react-dom/test-utils'
import sinon from 'sinon'
import { render } from 'react-dom'
import shallowEqual from 'fbjs/lib/shallowEqual'
import { themr, themeable } from '../../src/index'

const documentDom = new JSDOM(`<!doctype html><html><body></body></html>`)

describe('Themr decorator function', () => {
  class Passthrough extends Component {
    render() {
      const { theme, ...props } = this.props //eslint-disable-line no-unused-vars
      return (
        <div
          ref={node => {
            this.rootNode = node
          }}
          {...props}
        />
      )
    }
  }

  class ProviderMock extends Component {
    static childContextTypes = {
      themr: PropTypes.object.isRequired
    }

    getChildContext() {
      return { themr: { theme: this.props.theme } }
    }

    render() {
      return Children.only(this.props.children)
    }
  }

  beforeEach(() => {
    global.document = documentDom
    global.window = document.defaultView
    global.navigator = global.window.navigator

    jest.spyOn(console, 'error')
    global.console.error.mockImplementation(() => {})
  })

  afterEach(() => {
    global.console.error.mockRestore()
  })

  test("passes a context theme object using the component's context", () => {
    const theme = { Container: { foo: 'foo_1234' } }

    @themr('Container')
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const tree = TestUtils.renderIntoDocument(
      <ProviderMock theme={theme}>
        <Container />
      </ProviderMock>
    )

    const container = TestUtils.findRenderedComponentWithType(tree, Container)
    expect(container.context.themr.theme).toBe(theme)
  })

  test("passes a context theme object using the component's theme prop", () => {
    const containerTheme = { foo: 'foo_1234' }
    const theme = { Container: containerTheme }

    @themr('Container')
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const tree = TestUtils.renderIntoDocument(
      <ProviderMock theme={theme}>
        <Container />
      </ProviderMock>
    )

    const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
    expect(stub.props.theme).toEqual(containerTheme)
  })

  test('passes a theme composed from context, local and props', () => {
    const containerTheme = { foo: 'foo_123' }
    const containerThemeLocal = { foo: 'foo_567' }
    const containerThemeProps = { foo: 'foo_89' }
    const theme = { Container: containerTheme }

    @themr('Container', containerThemeLocal)
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const tree = TestUtils.renderIntoDocument(
      <ProviderMock theme={theme}>
        <Container theme={containerThemeProps} />
      </ProviderMock>
    )

    const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
    const expectedTheme = { foo: 'foo_123 foo_567 foo_89' }
    expect(stub.props.theme).toEqual(expectedTheme)
  })

  test('passes a default theme when composition is disabled and with no props', () => {
    const containerTheme = { foo: 'foo_123' }
    const containerThemeLocal = { foo: 'foo_567' }
    const theme = { Container: containerTheme }

    @themr('Container', containerThemeLocal, { composeTheme: false })
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const tree = TestUtils.renderIntoDocument(
      <ProviderMock theme={theme}>
        <Container />
      </ProviderMock>
    )

    const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
    expect(stub.props.theme).toEqual(containerThemeLocal)
  })

  test('when providing decorator options composes a theme object deeply', () => {
    const containerTheme = { foo: 'foo_123' }
    const containerTheme2 = { foo: 'foo_567' }
    const theme = { Container: containerTheme }

    @themr('Container')
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const tree = TestUtils.renderIntoDocument(
      <ProviderMock theme={theme}>
        <Container theme={containerTheme2} />
      </ProviderMock>
    )

    const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
    const expectedTheme = { foo: 'foo_123 foo_567' }
    expect(stub.props.theme).toEqual(expectedTheme)
  })

  test('when providing decorator options composes a theme object softly', () => {
    const containerTheme = { foo: 'foo_123', bar: 'bar_765' }
    const containerTheme2 = { foo: 'foo_567' }
    const theme = { Container: containerTheme }

    @themr('Container', null, { composeTheme: 'softly' })
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const tree = TestUtils.renderIntoDocument(
      <ProviderMock theme={theme}>
        <Container theme={containerTheme2} />
      </ProviderMock>
    )

    const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
    const expectedTheme = { foo: 'foo_567', bar: 'bar_765' }
    expect(stub.props.theme).toEqual(expectedTheme)
  })

  test('when providing decorator options does not compose a theme', () => {
    const containerTheme = { foo: 'foo_123' }
    const containerTheme2 = { foo: 'foo_567' }
    const theme = { Container: containerTheme }

    @themr('Container', null, { composeTheme: false })
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const tree = TestUtils.renderIntoDocument(
      <ProviderMock theme={theme}>
        <Container theme={containerTheme2} />
      </ProviderMock>
    )

    const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
    expect(stub.props.theme).toEqual(containerTheme2)
  })

  test('when providing props options composes a theme object deeply', () => {
    const containerTheme = { foo: 'foo_123' }
    const containerTheme2 = { foo: 'foo_567' }
    const theme = { Container: containerTheme }

    @themr('Container')
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const tree = TestUtils.renderIntoDocument(
      <ProviderMock theme={theme}>
        <Container theme={containerTheme2} composeTheme="deeply" />
      </ProviderMock>
    )

    const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
    const expectedTheme = { foo: 'foo_123 foo_567' }
    expect(stub.props.theme).toEqual(expectedTheme)
  })

  test('when providing props options composes a theme object softly', () => {
    const containerTheme = { foo: 'foo_123', bar: 'bar_765' }
    const containerTheme2 = { foo: 'foo_567' }
    const theme = { Container: containerTheme }

    @themr('Container')
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const tree = TestUtils.renderIntoDocument(
      <ProviderMock theme={theme}>
        <Container theme={containerTheme2} composeTheme="softly" />
      </ProviderMock>
    )

    const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
    const expectedTheme = { foo: 'foo_567', bar: 'bar_765' }
    expect(stub.props.theme).toEqual(expectedTheme)
  })

  test('when providing props options does not compose a theme', () => {
    const containerTheme = { foo: 'foo_123' }
    const containerTheme2 = { foo: 'foo_567' }
    const theme = { Container: containerTheme }

    @themr('Container')
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const tree = TestUtils.renderIntoDocument(
      <ProviderMock theme={theme}>
        <Container theme={containerTheme2} composeTheme={false} />
      </ProviderMock>
    )

    const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
    expect(stub.props.theme).toEqual(containerTheme2)
  })

  test('throws an error if an invalid composition option passed', () => {
    expect(() => {
      @themr('Container', null, { composeTheme: 'foo' })
      class Container extends Component {
        //eslint-disable-line no-unused-vars
        render() {
          return <Passthrough {...this.props} />
        }
      }
    }).toThrow(/composeTheme/)
  })

  test('works properly when no theme is provided', () => {
    @themr('Container')
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const tree = TestUtils.renderIntoDocument(<Container />)

    const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
    expect(stub.props.theme).toEqual({})
  })

  test('gets the reference to a decorated component using innerRef prop', () => {
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const spy = sinon.stub()
    const ThemedContainer = themr('Container')(Container)
    const tree = TestUtils.renderIntoDocument(
      <ThemedContainer innerRef={spy} />
    )
    const stub = TestUtils.findRenderedComponentWithType(tree, Container)
    expect(spy.withArgs(stub).calledOnce).toBe(true)
  })

  test('allows to customize props passing using mapThemrProps from props', () => {
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const spy = sinon.stub()
    const hoc = C => ({ withRef, ...rest }) => <C ref={withRef} {...rest} />
    const customMapper = (props, theme) => {
      const {
        composeTheme,
        innerRef,
        mapThemrProps,
        themeNamespace,
        ...rest
      } = props //eslint-disable-line no-unused-vars
      return { withRef: innerRef, theme, className: 'fooClass', ...rest }
    }
    const theme = {}
    const DecoratedContainer = hoc(Container)
    const ThemedDecoratedContainer = themr(
      'Container',
      theme
    )(DecoratedContainer)
    const tree = TestUtils.renderIntoDocument(
      <ThemedDecoratedContainer innerRef={spy} mapThemrProps={customMapper} />
    )
    const stub = TestUtils.findRenderedComponentWithType(tree, Container)
    expect(spy.withArgs(stub).calledOnce).toBe(true)
    expect(stub.props).toMatchObject({ theme, className: 'fooClass' })
  })

  test('allows to customize props passing using mapThemrProps from options', () => {
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const spy = sinon.stub()
    const hoc = C => ({ withRef, ...rest }) => <C ref={withRef} {...rest} />
    const customMapper = (props, theme) => {
      const {
        composeTheme,
        innerRef,
        mapThemrProps,
        themeNamespace,
        ...rest
      } = props //eslint-disable-line no-unused-vars
      return { withRef: innerRef, theme, className: 'fooClass', ...rest }
    }
    const theme = {}
    const DecoratedContainer = hoc(Container)
    const ThemedDecoratedContainer = themr(
      'Container',
      {},
      { mapThemrProps: customMapper }
    )(DecoratedContainer)
    const tree = TestUtils.renderIntoDocument(
      <ThemedDecoratedContainer innerRef={spy} />
    )
    const stub = TestUtils.findRenderedComponentWithType(tree, Container)
    expect(spy.withArgs(stub).calledOnce).toBe(true)
    expect(stub.props).toMatchObject({ theme, className: 'fooClass' })
  })

  test('should throw if themeNamespace passed without theme', () => {
    const theme = { Container: { foo: 'foo_1234' } }

    @themr('Container')
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    expect(() =>
      TestUtils.renderIntoDocument(
        <ProviderMock theme={theme}>
          <Container themeNamespace="container" />
        </ProviderMock>
      )
    ).toThrow(
      /Invalid themeNamespace use in friendsofreactjs\/react-css-themr. themeNamespace prop should be used only with theme prop./
    )
  })

  test('when providing a themeNamespace prop composes a theme', () => {
    const containerTheme = { foo: 'foo_123' }
    const containerThemeLocal = { foo: 'foo_567' }
    const containerThemeProps = { foo: 'foo_89', containerFoo: 'foo_000' }
    const theme = { Container: containerTheme }

    @themr('Container', containerThemeLocal)
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const tree = TestUtils.renderIntoDocument(
      <ProviderMock theme={theme}>
        <Container theme={containerThemeProps} themeNamespace="container" />
      </ProviderMock>
    )

    const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
    const expectedTheme = { foo: 'foo_123 foo_567 foo_000' }
    expect(stub.props.theme).toEqual(expectedTheme)
  })

  test('should copy statics from ThemedComponent', () => {
    const propTypes = {
      foo: PropTypes.array
    }
    const defaultProps = {
      foo: []
    }
    @themr('Foo')
    class Foo extends Component {
      static propTypes = propTypes
      static defaultProps = defaultProps
    }
    expect(Foo.propTypes.foo).toBe(propTypes.foo)
    expect(Foo.defaultProps.foo).toBe(defaultProps.foo)
  })

  test('should copy non-react statics from ThemedComponent', () => {
    const meta = { name: 'Foo' }

    @themr('Foo')
    class Foo extends Component {
      static meta = meta
    }

    expect(Foo.meta.name).toBe(meta.name)
  })

  test('should not wrap multiple time if used with already wrapped component with the same key', () => {
    const foo = {
      foo: 'foo'
    }
    const bar = {
      bar: 'bar'
    }
    const key = 'Foo'

    @themr(key, foo)
    class Foo extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }
    const Bar = themr(key, bar)(Foo)
    expect(Bar).toBe(Foo)

    const tree = TestUtils.renderIntoDocument(<Bar />)

    const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
    expect(stub.props.theme).toEqual({
      ...foo,
      ...bar
    })
  })

  test('should not update theme prop on rerender if nothing changed', () => {
    const spy = sinon.stub().returns(<div />)
    const div = document.createElement('div')

    @themr('Container')
    class Container extends Component {
      shouldComponentUpdate(nextProps) {
        return !shallowEqual(nextProps, this.props)
      }

      render() {
        return spy()
      }
    }

    render(<Container />, div)

    render(<Container />, div)

    expect(spy.calledOnce).toBe(true)
  })

  test('should update theme prop on rerender if theme or themeNamespace or composeTheme changed', () => {
    const spy = sinon.stub().returns(<div />)
    const div = document.createElement('div')

    @themr('Container')
    class Container extends Component {
      shouldComponentUpdate(nextProps) {
        return !shallowEqual(nextProps, this.props)
      }

      render() {
        return spy()
      }
    }
    const themeA = {}
    const themeB = {}
    const themeNamespace = 'nsA'

    render(<Container theme={themeA} />, div)

    render(<Container theme={themeB} />, div)

    expect(spy.calledTwice).toBe(true)

    render(<Container theme={themeB} themeNamespace={themeNamespace} />, div)

    expect(spy.calledThrice).toBe(true)

    render(
      <Container
        theme={themeB}
        themeNamespace={themeNamespace}
        composeTheme={'deeply'}
      />,
      div
    )

    expect(spy.calledThrice).toBe(true)

    render(
      <Container
        theme={themeB}
        themeNamespace={themeNamespace}
        composeTheme={'softly'}
      />,
      div
    )

    expect(spy.callCount === 4).toBe(true)
  })

  test('should not pass internal themr props to WrappedComponent', () => {
    @themr('Container')
    class Container extends Component {
      render() {
        return <Passthrough {...this.props} />
      }
    }

    const tree = TestUtils.renderIntoDocument(<Container />)

    const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
    expect(stub.props.themeNamespace).toBeFalsy()
    expect(stub.props.composeTheme).toBeFalsy()
    expect(stub.props.theme).toBeTruthy()
  })
})

describe('themeable function', () => {
  test('should support merging nested objects', () => {
    const themeA = {
      test: 'test',
      nested: {
        foo: 'foo',
        bar: 'bar'
      }
    }

    const themeB = {
      test: 'test2',
      nested: {
        foo: 'foo2',
        test: 'test'
      }
    }

    const expected = {
      test: 'test test2',
      nested: {
        foo: 'foo foo2',
        bar: 'bar',
        test: 'test'
      }
    }

    const result = themeable(themeA, themeB)
    expect(result).toEqual(expected)
  })

  test('should skip duplicated keys classNames', () => {
    const themeA = { test: 'test' }
    const themeB = { test: 'test test2' }
    const expected = { test: 'test test2' }
    const result = themeable(themeA, themeB)
    expect(result).toEqual(expected)
  })

  test('should take mixin value if original does not contain one', () => {
    const themeA = {}
    const themeB = {
      test: 'test',
      nested: {
        bar: 'bar'
      }
    }
    const expected = themeB
    const result = themeable(themeA, themeB)
    expect(result).toEqual(expected)
  })

  test('should take original value if mixin does not contain one', () => {
    const themeA = {
      test: 'test',
      nested: {
        bar: 'bar'
      }
    }
    const themeB = {}
    const expected = themeA
    const result = themeable(themeA, themeB)
    expect(result).toEqual(expected)
  })

  test('should skip function values for usage with isomorphic-style-loader', () => {
    const themeA = {
      test: 'test',
      foo() {}
    }

    const themeB = {
      test: 'test2',
      bar() {}
    }

    const expected = {
      test: [themeA.test, themeB.test].join(' ')
    }

    const result = themeable(themeA, themeB)
    expect(result).toEqual(expected)
  })

  test('should throw when merging objects with non-objects', () => {
    const themeA = {
      test: 'test'
    }
    const themeB = {
      test: {}
    }
    expect(() => themeable(themeA, themeB)).toThrow()
  })

  test('should throw when merging non-objects with objects', () => {
    const themeA = {
      test: {}
    }
    const themeB = {
      test: 'test'
    }
    expect(() => themeable(themeA, themeB)).toThrow()
  })

  test('should support theme spreads', () => {
    const a = {
      test: 'a'
    }
    const b = {
      test: 'b'
    }
    const c = {
      test: 'foo',
      foo: 'foo'
    }
    const expected = {
      test: 'a b foo',
      foo: 'foo'
    }
    const result = themeable(a, b, c)
    expect(result).toEqual(expected)
  })

  test('should skip undefined mixin values', () => {
    const a = {
      test: 'a'
    }
    const b = {
      test: undefined
    }
    const expected = a
    const result = themeable(a, b)
    expect(result).toEqual(expected)
  })
})

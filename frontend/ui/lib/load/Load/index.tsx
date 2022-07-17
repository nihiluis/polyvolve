import * as React from "react"
import cx from "classnames"

import * as loadStyle from "./load.module.scss"

interface Props {
  size?: number
  text?: string
  show?: boolean
  useShow?: boolean
}

interface State {
  show: boolean
}

const minimumDuration = 500

export default class Load extends React.Component<Props, State> {
  lastLoaded = 0

  constructor(props: Props) {
    super(props)

    this.state = {
      show: false
    }
  }

  public static defaultProps: Partial<Props> = {
    size: 32,
    useShow: false,
  }

  componentDidUpdate(prevProps: Props) {
    const newProps = this.props

    if (prevProps.useShow) {
      if (prevProps.show && !newProps.show) {
        const diff = Date.now() - this.lastLoaded
        if (diff < minimumDuration) {
          setTimeout(() => { this.setState({ show: false }) }, minimumDuration - diff)
        } else {
          this.setState({ show: false })
        }

        return
      }

      if (!prevProps.show && newProps.show) {
        this.setState({ show: true }, () => this.lastLoaded = Date.now())
      }
    }
  }

  render(): JSX.Element | null {
    const { size, text, useShow } = this.props
    const { show } = this.state

    if (useShow && !show) {
      return null
    }

    return text ? (
      <div className={loadStyle.loadWithText}>
        <div className={loadStyle.load}>
          <div className={loadStyle.skFadingCircle} style={{ width: size, height: size }}>
            <div className={cx(loadStyle.skCircle1, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle2, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle3, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle4, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle5, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle6, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle7, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle8, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle9, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle10, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle11, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle12, loadStyle.skCircle)}></div>
          </div>
        </div>
        {text}
      </div>
    ) : (
        <div className={loadStyle.load}>
          <div className={loadStyle.skFadingCircle} style={{ width: size, height: size }}>
            <div className={cx(loadStyle.skCircle1, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle2, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle3, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle4, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle5, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle6, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle7, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle8, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle9, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle10, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle11, loadStyle.skCircle)}></div>
            <div className={cx(loadStyle.skCircle12, loadStyle.skCircle)}></div>
          </div>
        </div>
      )
  }
}

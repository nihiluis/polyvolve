import * as React from "react"
import cx from "classnames"
import { findDOMNode } from "react-dom"
import * as process from "process"

import * as style from "./style.module.scss"
import findTabbable from "./tabbable"
import * as focusManager from "./focusmanager"
import * as bodyClassList from "./bodyclasslist"

export interface Props {
  className?: string
  isOpen: boolean
  closeTimeoutMS?: number
  bodyOpenClassName?: string
  overlayClassName?: string
  shouldCloseOnOverlayClick?: boolean
  role?: string
  positionRef?: React.Component | HTMLElement | null
  // only y and xy accepted rn
  positionType?: "y" | "xy" | "x"
  onRequestClose: (event: Event) => void
  onAfterOpen?: () => void
  unfix?: boolean
  adjusted?: boolean
  center?: boolean
}

export interface State {
  afterOpen: boolean
  beforeClose: boolean
  isOpen?: boolean
  closesAt?: any
}

interface PortalPosition {
  left: number
  top: number
}

const TAB_KEY = 9
const ESC_KEY = 27

export default class Portal extends React.Component<Props, State> {
  shouldClose: boolean | null
  focusAfterRender: boolean
  content: HTMLElement
  overlay: HTMLElement
  node: Node
  closeTimer: any
  styleAttr: { left?: string, top?: string } = {}
  overlayStyle: { position?: "absolute" } = {}

  public static defaultProps: Partial<Props> = {
    shouldCloseOnOverlayClick: true,
    closeTimeoutMS: 0,
    bodyOpenClassName: style.modalOpen
  }

  constructor(props) {
    super(props)

    this.state = {
      afterOpen: false,
      beforeClose: false,
    }

    this.shouldClose = null
  }

  componentDidMount() {
    const { isOpen, unfix } = this.props
    // Focus needs to be set when mounting and already open
    if (isOpen) {
      this.setFocusAfterRender(true)
      this.open()
    }

    if (unfix) {
      this.overlayStyle.position = "absolute"
    }

    this.updatePosition(this.props)
  }

  UNSAFE_componentWillReceiveProps(newProps: Props) {
    if (process.env.NODE_ENV !== "production") {
      if (newProps.bodyOpenClassName !== this.props.bodyOpenClassName) {
        // eslint-disable-next-line no-console
        console.warn(
          "React-Modal: bodyOpenClassName prop has been modified. " +
          "This may cause unexpected behavior when multiple modals are open."
        )
      }
    }
    // Focus only needs to be set once when the modal is being opened
    if (!this.props.isOpen && newProps.isOpen) {
      this.setFocusAfterRender(true)
      this.open()
    } else if (this.props.isOpen && !newProps.isOpen) {
      this.close()
    }

    if (newProps.positionRef && newProps.positionRef !== this.props.positionRef) {
      this.updatePosition(newProps)
    }
  }

  componentDidUpdate() {
    if (this.focusAfterRender) {
      this.focusContent()
      this.setFocusAfterRender(false)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.closeTimer)
  }

  setFocusAfterRender = focus => {
    this.focusAfterRender = focus
  }

  setOverlayRef = (overlay) => {
    this.overlay = overlay
  }

  setContentRef = (content) => {
    this.content = content
  }

  beforeOpen() {
    const { bodyOpenClassName } = this.props
    // Add body class
    bodyClassList.add(bodyOpenClassName)
  }

  afterClose = () => {
    const { bodyOpenClassName } = this.props
    bodyClassList.remove(bodyOpenClassName)

    focusManager.returnFocus()
    focusManager.teardownScopedFocus()
  }

  open = () => {
    this.beforeOpen()
    if (this.state.afterOpen && this.state.beforeClose) {
      clearTimeout(this.closeTimer)
      this.setState({ beforeClose: false })
    } else {
      focusManager.setupScopedFocus(this.node)
      focusManager.markForFocusLater()
      this.setState({ isOpen: true }, () => {
        this.setState({ afterOpen: true })

        if (this.props.isOpen && this.props.onAfterOpen) {
          this.props.onAfterOpen()
        }
      })
    }
  }

  close = () => {
    if (this.props.closeTimeoutMS as number > 0) {
      this.closeWithTimeout()
    } else {
      this.closeWithoutTimeout()
    }
  }

  // Don"t steal focus from inner elements
  focusContent = () =>
    (this.content && !this.contentHasFocus()) && this.content.focus()

  closeWithTimeout = () => {
    const closesAt = Date.now() + (this.props.closeTimeoutMS as number)
    this.setState({ beforeClose: true, closesAt }, () => {
      this.closeTimer = setTimeout(
        this.closeWithoutTimeout,
        this.state.closesAt - Date.now()
      )
    })
  }

  closeWithoutTimeout = () => {
    this.setState({
      beforeClose: false,
      isOpen: false,
      afterOpen: false,
      closesAt: null
    }, this.afterClose)
  }

  handleKeyDown = event => {
    if (event.keyCode === TAB_KEY) {
      scopeTab(this.content, event)
    }
    if (event.keyCode === ESC_KEY) {
      event.preventDefault()
      this.requestClose(event)
    }
  }

  handleOverlayOnClick = event => {
    if (this.shouldClose === null) {
      this.shouldClose = true
    }

    if (this.shouldClose && this.props.shouldCloseOnOverlayClick) {
      if (this.ownerHandlesClose()) {
        this.requestClose(event)
      } else {
        this.focusContent()
      }
    }
    this.shouldClose = null
  }

  handleContentOnClick = () => {
    this.shouldClose = false
  }

  requestClose = (event: Event) =>
    this.ownerHandlesClose() && this.props.onRequestClose(event)

  ownerHandlesClose = () =>
    this.props.onRequestClose

  shouldBeClosed = () =>
    !this.state.isOpen && !this.state.beforeClose

  contentHasFocus = () =>
    document.activeElement === this.content ||
    this.content.contains(document.activeElement)

  render() {
    const { className, overlayClassName, center } = this.props

    const positioned: boolean = this.props.positionRef ? true : false

    return this.shouldBeClosed() ? null : (
      <div ref={this.setOverlayRef}
        className={cx(style.modalOverlay, overlayClassName, { [style.center]: center as boolean })}
        onClick={this.handleOverlayOnClick}
        style={this.overlayStyle} >
        <div ref={this.setContentRef}
          className={cx(style.modalContent, className, { [style.positioned]: positioned, [style.unpositioned]: !positioned })}
          tabIndex={-1}
          onKeyDown={this.handleKeyDown}
          onClick={this.handleContentOnClick}
          role={this.props.role}
          style={this.styleAttr}>
          {this.props.children}
        </div>
      </div>
    )
  }

  updatePosition(props: Props) {
    const element = props.positionRef instanceof React.Component ? findDOMNode(props.positionRef) as HTMLElement : props.positionRef

    if (element) {
      const pos = getPosition(element, this.props.adjusted as boolean)
      switch (props.positionType) {
        case "y":
          this.styleAttr.top = `${pos.top}px`
          break
        case "xy":
        default:
          this.styleAttr.left = `${pos.left}px`
          this.styleAttr.top = `${pos.top}px`
          break
      }
    }
  }
}

function scopeTab(node, event) {
  const tabbable = findTabbable(node)
  if (!tabbable.length) {
    event.preventDefault()
    return
  }
  const finalTabbable = tabbable[event.shiftKey ? 0 : tabbable.length - 1]
  const leavingFinalTabbable = (
    finalTabbable === document.activeElement ||
    // handle immediate shift+tab after opening with mouse
    node === document.activeElement
  )
  if (!leavingFinalTabbable) return
  event.preventDefault()
  const target = tabbable[event.shiftKey ? tabbable.length - 1 : 0]
  target.focus()
}

/*function getPosition(el: HTMLElement): PortalPosition {
  const { width, left } = el.getBoundingClientRect()

  const pos = {
    left: left + width,
    top: el.offsetTop
  }

  console.log(pos)

  return pos
}*/

function getPosition(el: HTMLElement, adjusted: boolean): PortalPosition {
  const box = el.getBoundingClientRect()

  const body = document.body
  const docEl = document.documentElement

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft

  const clientTop = docEl.clientTop || body.clientTop || 0
  const clientLeft = docEl.clientLeft || body.clientLeft || 0

  const top = box.top + scrollTop - clientTop
  const left = box.left + scrollLeft - clientLeft

  const adjTop = adjusted ? box.height : 0

  //const adjLeft = adjusted ? box.width : 0
  return { top: Math.round(top + adjTop), left: Math.round(left + box.width) }
}

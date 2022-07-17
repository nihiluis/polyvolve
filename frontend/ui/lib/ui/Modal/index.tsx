import * as React from "react"
import * as ReactDOM from "react-dom"
//import cx from "classnames"

import Portal from "./Portal"
import * as style from "./style.module.scss"

//const renderSubtreeIntoContainer = ReactDOM.unstable_renderSubtreeIntoContainer;

export interface Props {
  className?: string
  parentSelector?: () => HTMLElement
  isOpen: boolean
  onRequestClose: (event: Event) => void
  onAfterOpen?: () => void
  closeTimeoutMS?: number
  overlayClassName?: string
  portalClassName?: string
  unfix?: boolean
  center?: boolean
  showOnHover?: boolean
  positionRef?: React.Component | HTMLElement | null
  positionType?: "y" | "xy" | "x"
  adjusted?: boolean
}

export interface ModalPosition {
  left: number
  top: number
}

export default class Modal extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    parentSelector: function () { return document.body; },
    portalClassName: style.modalPortal,
    unfix: false,
    showOnHover: false,
    center: true,
    positionType: "xy",
    adjusted: true
  }

  node: HTMLDivElement
  portal: Portal

  getParentElement(parentSelector: () => HTMLElement) {
    return parentSelector()
  }

  componentDidMount() {
    this.node.className = this.props.portalClassName as string

    const parent = this.getParentElement(this.props.parentSelector as () => HTMLElement)
    parent.appendChild(this.node)

    //this.renderPortal(this.props)
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { isOpen } = newProps
    // Stop unnecessary renders if modal is remaining closed
    if (!this.props.isOpen && !isOpen) return

    const currentParent = this.getParentElement(this.props.parentSelector as () => HTMLElement)
    const newParent = this.getParentElement(newProps.parentSelector)

    if (newParent !== currentParent) {
      currentParent.removeChild(this.node)
      newParent.appendChild(this.node)
    }


    //this.renderPortal(newProps)
  }

  UNSAFE_componentWillUpdate(newProps) {
    if (newProps.portalClassName !== this.props.portalClassName) {
      this.node.className = newProps.portalClassName
    }
  }

  componentWillUnmount() {
    if (!this.node || !this.portal) return

    const state = this.portal.state
    const now = Date.now()
    const closesAt = state.isOpen && this.props.closeTimeoutMS
      && (state.closesAt
        || now + this.props.closeTimeoutMS)

    if (closesAt) {
      if (!state.beforeClose) {
        this.portal.closeWithTimeout()
      }

      setTimeout(this.removePortal, closesAt - now)
    } else {
      this.removePortal()
    }
  }

  removePortal = () => {
    // ReactDOM.unmountComponentAtNode(this.node)
    const parent = this.getParentElement(this.props.parentSelector as () => HTMLElement)
    parent.removeChild(this.node)
  }

  createPortal = (): React.ReactPortal => {
    return ReactDOM.createPortal((
      <Portal {...this.props} />
    ), this.node)
  }

  portalRef = ref => {
    this.portal = ref;
  }

  render() {
    if (!this.node) {
      this.node = document.createElement("div");
    }

    return ReactDOM.createPortal((
      <Portal {...this.props} />
    ), this.node)
  }
}

import * as React from "react"

import Page from "./Page"
import PageSelect from "./PageSelect"

import * as style from "./style.module.scss"

interface Props {
  className?: string
  render: (props: WizardRenderProps, switchPage: (page: number) => void) => JSX.Element
  maxPage: number
  useArrowKeys?: boolean
}

interface State {
  page: number
}

export interface WizardRenderProps {
  page: number
  maxPage: number
}

const upKeyCode = 38
const rightKeyCode = 40

export { Page, PageSelect }
export default class Wizard extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    useArrowKeys: true
  }

  constructor(props: Props) {
    super(props)

    this.state = { page: 1 }
  }

  componentDidMount() {
    // I should likely use a React ref for this
    document.body.addEventListener("keyup", this.handleKeyDown)
    // register left right listener
  }

  componentWillUnmount() {
    document.body.removeEventListener("keyup", this.handleKeyDown)
    // unregister left right listener
  }

  handleKeyDown = (event: KeyboardEvent) => {
    const { page } = this.state

    if (!event.ctrlKey && event.key === "ArrowLeft") {
      this.switchPage(page - 1)
    } else if (!event.ctrlKey && event.key === "ArrowRight") {
      this.switchPage(page + 1)
    }
  }

  switchPage = (page: number) => {
    const { maxPage } = this.props
    if (page > maxPage) {
      page = maxPage
    } else if (page < 1) {
      return
    }
    this.setState({ page })
  }

  render(): JSX.Element {
    const { className, render, maxPage } = this.props

    return (
      <div className={style.wizardContainer}>
        {render({ page: this.state.page, maxPage }, this.switchPage)}
      </div>
    )
  }
}

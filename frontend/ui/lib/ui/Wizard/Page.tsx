import * as React from "react"

interface Props {
    currentPage: number
    showWhenPage: number
}

const Page: React.FunctionComponent<Props> = props =>
    <React.Fragment>
        {props.currentPage === props.showWhenPage && props.children}
    </React.Fragment>

export default Page
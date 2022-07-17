import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"

import { RootState } from "../../redux"
import { dashboardStyle } from "../../lib/reexports";

interface Props {
}

class Dashboard extends React.Component<Props> {
  render(): JSX.Element {
    const { } = this.props

    return (
      <div>
        <h1 className={dashboardStyle.pageTitle}>Dashboard</h1>
        <div className={dashboardStyle.dashboardContainer}>
          <p>Your dashboard is currently empty.</p>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: RootState): Partial<Props> {
  return {
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<Props> {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)

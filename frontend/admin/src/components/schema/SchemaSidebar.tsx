import * as React from "react"
import Actions from "../ui/sidebar/Actions"
import RecentlyViewed from "../ui/sidebar/RecentlyViewed"
import { connect } from "react-redux"
import { RootState } from "../../redux"

interface Props {
  data?: undefined
}

class SchemaSidebar extends React.Component<Props> {
  render(): JSX.Element {
    const { data } = this.props

    return (
      <React.Fragment>
        <Actions>
          {!data && "..."}
          {data && (
            <ul>
              <li>
                <a>Placeholder</a>
              </li>
            </ul>
          )}
        </Actions>
        <RecentlyViewed />
      </React.Fragment>
    )
  }
}

function mapStateToProps(state: RootState): Props {
  return {}
}

export default connect(mapStateToProps)(SchemaSidebar)

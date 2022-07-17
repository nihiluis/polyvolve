import * as React from "react"
import Actions from "../ui/sidebar/Actions"
import RecentlyViewed from "../ui/sidebar/RecentlyViewed"
import { connect } from "react-redux"
import { RootState } from "../../redux"
import { Dispatch } from "redux"
import { TeamGlobalActions } from "../../redux/team"
import { Team } from "polyvolve-ui/lib/@types"
import { WithRouterProps } from "next/dist/client/with-router"

interface Props extends WithRouterProps {
  team?: Team
  teamGlobalActions?: typeof TeamGlobalActions
}

class TeamSidebar extends React.Component<Props> {
  onGoToOverview = () => this.props.router.push("/overview/team")

  onDelete = () => {
    const { teamGlobalActions, team, router } = this.props

    teamGlobalActions!.removeTeamRequest({ id: team.id })

    router.push("/overview/team")
  }

  render(): JSX.Element {
    const { team: data } = this.props

    return (
      <React.Fragment>
        <Actions>
          {!data && "..."}
          {data && (
            <ul>
              <li>
                <a onClick={this.onGoToOverview}>Go to overview</a>
              </li>
              <li>
                <a onClick={this.onDelete}>Delete team</a>
              </li>
              <li>
                <a onClick={() => {}}>Copy direct link</a>
              </li>
            </ul>
          )}
        </Actions>
        <RecentlyViewed />
      </React.Fragment>
    )
  }
}

function mapStateToProps(state: RootState): Partial<Props> {
  return {
    team: state.team.specified.data,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<Props> {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamSidebar)

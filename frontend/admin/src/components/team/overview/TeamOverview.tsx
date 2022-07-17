import * as React from "react"
import { bindActionCreators, Dispatch } from "redux"
import { connect } from "react-redux"
import { Team } from "polyvolve-ui/lib/@types"
import { Button } from "polyvolve-ui/lib"
import { Icon } from "polyvolve-ui/lib/icons"

import TeamCreate from "./TeamCreate"
import { RootState } from "../../../redux"
import { TeamGlobalActions, TeamCreationActions } from "../../../redux/team"
import Link from "next/link"
import SortableOverview from "../../utils/SortableOverview"

import { overviewStyle } from "../../../lib/reexports"
import * as removeSvg from "../../../assets/icons/trash2.svg"

interface Props {
  loading: boolean
  initialized: boolean
  updated: boolean
  all: Team[]
  creationError?: string
  teamGlobalActions?: typeof TeamGlobalActions
  teamCreateActions?: typeof TeamCreationActions
  creationLoading: boolean
}

interface State {
  showAddTeam: boolean
}

class TeamList extends React.Component<Props, State> {
  addTeamRef: React.Ref<any>
  constructor(props: Props) {
    super(props)

    this.state = { showAddTeam: false }
    this.addTeamRef = React.createRef()
  }

  componentDidMount() {
    this.props.teamGlobalActions!.loadTeamsRequest({})
  }

  componentDidUpdate(prevProps: Props) {
    if (
      !this.props.creationError &&
      !this.props.creationLoading &&
      prevProps.creationLoading
    ) {
      this.setState({ showAddTeam: false })
    }
  }

  clickRemoveTeam = (team: Team) => {
    this.props.teamGlobalActions!.removeTeamRequest({ id: team.id })
  }

  render(): JSX.Element {
    const { all, initialized, loading, teamCreateActions } = this.props

    return (
      <React.Fragment>
        {initialized && (
          <div>
            <h1 className={overviewStyle.pageTitle}>Team overview</h1>
            <SortableOverview<Team>
              filters={[{ name: "Name", filterItem: () => [] }]}
              items={all}
              renderItem={team => (
                <div className={overviewStyle.listItem}>
                  <div className={overviewStyle.rowItem}>
                    <Link
                      key={`team-list-item-${team.id}-name`}
                      href={`/team/[teamId]`}
                      as={`/team/${team.id}`}>
                      <a>{team.name}</a>
                    </Link>
                    <Icon
                      key={`team-list-item-${team.id}-remove`}
                      src={removeSvg}
                      size={{ width: 16, height: 16 }}
                      title="Remove Team"
                      className={""}
                      onClick={() => this.clickRemoveTeam(team)}
                    />
                  </div>
                </div>
              )}
            />
            <div className={overviewStyle.buttonBarWithAdd}>
              <Button
                ref={this.addTeamRef}
                name="add-team"
                onClick={() => this.setState({ showAddTeam: true })}>
                Add new Team
              </Button>
            </div>
            <TeamCreate
              actions={teamCreateActions!}
              positionRef={this.addTeamRef}
              show={this.state.showAddTeam}
              onClose={() => this.setState({ showAddTeam: false })}
              loading={loading}
            />
          </div>
        )}
      </React.Fragment>
    )
  }
}

function mapStateToProps(state: RootState): Props {
  return {
    loading: state.team.global.loading,
    initialized: state.team.global.initialized,
    creationLoading: state.team.creation.loading,
    creationError: state.team.creation.error,
    updated: state.team.global.updated,
    all: state.team.global.all,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<Props> {
  return {
    teamGlobalActions: bindActionCreators(TeamGlobalActions, dispatch),
    teamCreateActions: bindActionCreators(TeamCreationActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamList)

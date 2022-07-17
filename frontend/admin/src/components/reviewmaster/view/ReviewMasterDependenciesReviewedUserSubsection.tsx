import * as React from "react"
import {
  MultiSelectElementMenu,
  MenuList,
  Button,
} from "polyvolve-ui/lib"

import SectionButtonBar from "../../ui/section/SectionButtonBar"
import Subsection from "../../ui/section/Subsection"
import SubsectionTitle from "../../ui/section/SubsectionTitle"
import SubsectionContent from "../../ui/section/SubsectionContent"
import SubsectionEditButton from "../../ui/section/SubsectionEditButton"
import { ReviewMaster, User } from "polyvolve-ui/lib/@types"
import { singleStyle, formStyle } from "../../../lib/reexports"
import { UserItem, UserItemMenu } from "../../single/dependencies/UserItem"

interface UpdateReviewMasterParams {
  id: string
  name: string
  userIds: string[]
}

interface Props {
  reviewMaster: ReviewMaster
  dependencies: User[]
  updateReviewMaster: (params: UpdateReviewMasterParams) => void
}

interface State {
  editting: boolean
  activeIds: string[]
}

class ReviewMasterDependenciesReviewedUserSubsection extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      editting: false,
      activeIds: props.reviewMaster.reviewedUsers
        ? props.reviewMaster.reviewedUsers.map(user => user.id)
        : [],
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      !prevProps.reviewMaster ||
      this.props.reviewMaster.id !== prevProps.reviewMaster.id
    ) {
      this.resetActiveReviewMastersFromProps()
    }
  }

  onUpdate = (newValues: string[]) => this.setState({ activeIds: newValues })

  toggleEditting = () => {
    const newEdittingState = !this.state.editting

    // resetActiveReviewMastersFromProps
    if (!newEdittingState) {
      const { reviewMaster } = this.props

      const newObjects: { id: string }[] = reviewMaster
        ? reviewMaster.reviewedUsers || []
        : []
      // TODO check how typing can be improved here.
      this.setState({
        activeIds: newObjects.map(obj => obj.id),
        editting: newEdittingState,
      })
    } else {
      this.setState({ editting: newEdittingState })
    }
  }

  resetActiveReviewMastersFromProps = () => {
    const { reviewMaster } = this.props

    const newUsers = reviewMaster ? reviewMaster.reviewedUsers || [] : []

    this.setState({
      activeIds: newUsers.map(user => user.id),
    })
  }

  save = () => {
    const { reviewMaster, updateReviewMaster } = this.props
    const { activeIds: activeUserIds } = this.state

    updateReviewMaster({
      id: reviewMaster.id,
      name: reviewMaster.name,
      userIds: activeUserIds,
    })
    this.setState({ editting: false })
  }

  getActiveUsers = (): User[] =>
    this.props.dependencies.filter(
      user => this.state.activeIds.indexOf(user.id) !== -1
    )

  onSelectAll = () =>
    this.setState({ activeIds: this.props.dependencies.map(user => user.id) })
  onUnselectAll = () => this.setState({ activeIds: [] })

  render(): JSX.Element {
    const { reviewMaster, dependencies } = this.props
    const { editting } = this.state
    const activeUsers = this.getActiveUsers()

    return (
      <Subsection size="full">
        {!editting && <SubsectionTitle title="Reviewed Users" />}
        {editting && <SubsectionTitle title="Select Users" />}
        <SubsectionContent size="full">
          {!editting && (
            <MenuList innerClassName={singleStyle.selectItemContainer}>
              {activeUsers.length === 0 && (
                <p>
                  {reviewMaster.name} has currently no associated Users. Click
                  edit to select new Users!
                </p>
              )}
              {activeUsers.map(user => (
                <UserItem key={`user-item-${user.id}`} user={user} />
              ))}
            </MenuList>
          )}
          {editting && dependencies.length < 80 && (
            <MultiSelectElementMenu
              values={this.state.activeIds}
              onClick={() => {}}
              disabled={!editting}
              onUpdate={this.onUpdate}
              className={singleStyle.activeSelectItemContainer}
              itemClassName={singleStyle.activeSelectItemContainerInner}
              items={dependencies.map(dependency => {
                return {
                  name: dependency.id,
                  element: UserItemMenu,
                  props: { user: dependency },
                }
              })}
            />
          )}
          {editting && (
            <div className={formStyle.selectUnselectContainer}>
              <a
                onClick={this.onSelectAll}
                className={formStyle.selectAll}>
                Select all
              </a>
              <a
                onClick={this.onUnselectAll}
                className={formStyle.unselectAll}>
                Unselect all
              </a>
            </div>
          )}
          {editting && (
            <SectionButtonBar>
              <Button
                type="button"
                name="master-user-cancel"
                onClick={this.toggleEditting}>
                Cancel
              </Button>
              <Button
                type="button"
                name="master-user-save"
                onClick={this.save}>
                Save
              </Button>
            </SectionButtonBar>
          )}
        </SubsectionContent>
        <SubsectionEditButton
          name="dependencies-user-edit"
          toggleEditting={this.toggleEditting}
          editting={editting}
        />
      </Subsection>
    )
  }
}

export default ReviewMasterDependenciesReviewedUserSubsection

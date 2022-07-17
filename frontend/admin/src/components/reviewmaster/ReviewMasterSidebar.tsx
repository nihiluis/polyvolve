import * as React from "react"
import Actions from "../ui/sidebar/Actions"
import RecentlyViewed from "../ui/sidebar/RecentlyViewed"
import { connect } from "react-redux"
import { RootState } from "../../redux"
import { Dispatch, bindActionCreators } from "redux"
import {
  ReviewMasterGlobalActions,
  ReviewMasterSpecifiedActions,
} from "../../redux/review/master"
import Link from "next/link"
import { NotificationMessageActions } from "../../redux/message"
import { ReviewMaster, ReviewMasterScoreItem } from "polyvolve-ui/lib/@types"
import { withRouter } from "next/router"
import { WithRouterProps } from "next/dist/client/with-router"

interface Props extends WithRouterProps {
  reviewMaster?: ReviewMaster
  overviewActions?: typeof ReviewMasterGlobalActions
  notificationMessageActions?: typeof NotificationMessageActions
  reviewMasterSpecifiedActions?: typeof ReviewMasterSpecifiedActions
  scoresExport?: ReviewMasterScoreItem[]
}

class ReviewMasterSidebar extends React.Component<Props> {
  onTriggerReminder = () => {
    const {
      overviewActions,
      notificationMessageActions,
      reviewMaster,
    } = this.props

    if (reviewMaster.status !== "Active") {
      notificationMessageActions!.warn(
        `${reviewMaster.name} must be set to active first.`
      )
      return
    }

    notificationMessageActions!.info(
      `Triggering reminder for ${reviewMaster.name}...`
    )
    overviewActions!.triggerReminderRequest({ id: reviewMaster.id })
  }

  onExportData = () => {
    const { reviewMasterSpecifiedActions, reviewMaster } = this.props

    reviewMasterSpecifiedActions.getScoresForDownloadRequest({
      id: reviewMaster.id,
    })
  }

  onDelete = () => {
    const { overviewActions, reviewMaster, router } = this.props

    overviewActions!.removeReviewMasterRequest({ id: reviewMaster.id })

    router.push("/overview/reviewmaster")
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.scoresExport !== this.props.scoresExport) {
      this.sendScoresExportDownload()
    }
  }

  sendScoresExportDownload() {
    let csvContent =
      "data:text/csv;charset=utf-8," +
      this.props.scoresExport.map(e => Object.values(e).join(",")).join("\n")

    const encodedURI = encodeURI(csvContent)
    window.open(encodedURI)
  }

  render(): JSX.Element {
    const { reviewMaster } = this.props

    return (
      <React.Fragment>
        <Actions>
          {!reviewMaster && "..."}
          {reviewMaster && (
            <ul>
              <li>
                <a onClick={this.onTriggerReminder}>Trigger reminder</a>
              </li>
              <li>
                <a onClick={this.onExportData}>Export data</a>
              </li>
              <li>
                <Link href="/overview/reviewmaster">
                  <a>Go to overview</a>
                </Link>
              </li>
              <li>
                <a onClick={this.onDelete}>Delete Master</a>
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
    reviewMaster: state.review.master.specified.data,
    scoresExport: state.review.master.specified.scoresExport,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<Props> {
  return {
    overviewActions: bindActionCreators(ReviewMasterGlobalActions, dispatch),
    reviewMasterSpecifiedActions: bindActionCreators(
      ReviewMasterSpecifiedActions,
      dispatch
    ),
    notificationMessageActions: bindActionCreators(
      NotificationMessageActions,
      dispatch
    ),
  }
}

export default withRouter(
  connect<{}, {}, Props>(
    mapStateToProps,
    mapDispatchToProps
  )(ReviewMasterSidebar)
)

import * as React from "react"
import { connect } from "react-redux"
import { Dispatch, bindActionCreators } from "redux"
import Router from "next/router"
import Link from "next/link"
import { Row, Notification, Error, Wizard, Avatar } from "polyvolve-ui/lib"
import { NextIcon, BackIcon, HomeIcon } from "polyvolve-ui/lib/icons"
import {
  ReviewUserValueContainer,
  ReviewMaster,
  User,
  ReviewSchema,
  Review,
} from "polyvolve-ui/lib/@types"

import { RootState } from "../../redux"
import { ReviewActions } from "../../redux/review"
import { DataGlobalActions } from "../../redux/overview"
import ReviewUserFormWrapper from "./form"
import { style, cx, reviewStyle } from "../../lib/reexports"
import * as reviewNewStyle from "../../style/reviewnew.module.scss"

interface Props {
  loading: boolean
  initialized: boolean
  saveInitialized?: boolean
  saveError?: string
  hash?: string
  userId?: string
  activeUserIdx: number
  reviewMaster?: ReviewMaster
  review?: Review
  schema?: ReviewSchema
  reviewedUsers: User[]
  reviewUser?: ReviewUserValueContainer
  dataGlobalActions?: typeof DataGlobalActions
  reviewActions?: typeof ReviewActions
}

class ReviewContent extends React.Component<Props> {
  getUserIdx = (props: Props = this.props): number => {
    let activeUserIdx = props.activeUserIdx || 0
    if (props.userId && props.reviewedUsers.length > 0) {
      const possibleIdx = props.reviewedUsers.findIndex(
        user => user.id === props.userId
      )
      if (possibleIdx !== -1) {
        activeUserIdx = possibleIdx
      }
    }

    return activeUserIdx
  }

  getActiveUser = (props: Props = this.props): User | null => {
    if (props.reviewedUsers.length === 0) {
      return null
    }

    return props.reviewedUsers[this.getUserIdx()]
  }

  updateUser = (userIdx: number, pushRoute: boolean = true) => {
    const { hash, reviewedUsers } = this.props

    if (userIdx >= this.props.reviewedUsers.length) {
      return
    }

    if (pushRoute) {
      Router.push(`/review?id=${hash}&userId=${reviewedUsers[userIdx].id}`)
    }
  }

  componentDidMount() {
    const {
      hash,
      reviewMaster,
      review,
      dataGlobalActions,
      reviewActions,
    } = this.props

    if (hash) {
      if (!reviewMaster) {
        dataGlobalActions.getReviewDataRequest({ hash })
      }

      if (!review) {
        dataGlobalActions.getOrCreateReviewRequest({ hash })
      }

      if (review) {
        const user = this.getActiveUser()
        if (user) {
          reviewActions.getOrCreateReviewUserRequest({ hash, review, user })
        }
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.review) {
      const user = this.getActiveUser(this.props)

      if (prevProps.userId !== this.props.userId) {
        this.props.reviewActions.getOrCreateReviewUserRequest({
          hash: this.props.hash,
          review: this.props.review,
          user,
        })
        return
      }

      const hasNewReview =
        (!prevProps.review && this.props.review) ||
        prevProps.review !== this.props.review

      if (hasNewReview) {
        if (user) {
          this.props.reviewActions.getOrCreateReviewUserRequest({
            hash: this.props.hash,
            review: this.props.review,
            user,
          })
        }
      }
    }
  }

  render(): JSX.Element {
    const {
      reviewedUsers,
      reviewUser,
      schema,
      loading,
      initialized,
      hash,
      saveError,
      reviewActions,
    } = this.props

    const activeUserIdx = this.getUserIdx()
    const hasUser = reviewedUsers.length > 0 && reviewUser
    const user = hasUser ? reviewedUsers[activeUserIdx] : null
    const hasNextUser = activeUserIdx < reviewedUsers.length
    const hasPreviousUser = activeUserIdx >= 1

    const nextUser = hasNextUser ? reviewedUsers[activeUserIdx + 1] : null
    const previousUser = hasPreviousUser
      ? reviewedUsers[activeUserIdx - 1]
      : null

    return (
      <div className={reviewNewStyle.topContainer}>
        {!reviewUser && !loading && initialized && (
          <Error>Unable to find users which can be reviewed.</Error>
        )}
        {!user && <Error>Unable to find User!</Error>}
        {user && (
          <div className={reviewNewStyle.reviewedPersonContainer}>
            <div className={reviewNewStyle.reviewedPersonTop}>
              <Avatar
                url={user.avatar}
                size={24}
                className={reviewStyle.miniAvatar}
                name={user.surname}
              />
              <p>
                <strong>{user.name + " " + user.surname}</strong>
              </p>
            </div>
            <p className={reviewNewStyle.reviewedPersonPosition}>
              {user.position}
            </p>
          </div>
        )}
        {reviewUser && user && (
          <div className={style.reviewContainer}>
            <div className={style.reviewInner}>
              <Wizard
                maxPage={schema.categories.length}
                render={({ page, maxPage }, switchPage) => (
                  <ReviewUserFormWrapper
                    hash={hash}
                    user={user}
                    reviewUser={reviewUser}
                    schema={schema}
                    saveError={saveError}
                    reviewActions={reviewActions}
                    users={reviewedUsers}
                    activeUserIdx={activeUserIdx}
                    switchUser={this.updateUser}
                    page={page}
                    maxPage={maxPage}
                    switchPage={switchPage}
                  />
                )}
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}

function mapStateToProps(state: RootState): Partial<Props> {
  return {
    reviewMaster: state.dataOverview.master,
    reviewedUsers: state.dataOverview.master
      ? state.dataOverview.master.reviewedUsers
      : [],
    schema: state.dataOverview.schema,
    review: state.dataOverview.review,
    reviewUser: state.review.reviewUser,
    loading: state.dataOverview.loading || state.review.loading,
    initialized: state.dataOverview.initialized && state.review.initialized,
    saveInitialized: state.review.saveInitialized,
    saveError: state.review.saveError,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<Props> {
  return {
    dataGlobalActions: bindActionCreators(DataGlobalActions, dispatch),
    reviewActions: bindActionCreators(ReviewActions, dispatch),
  }
}

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(ReviewContent)

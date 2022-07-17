import * as React from "react"
import { bindActionCreators, Dispatch } from "redux"
import { connect } from "react-redux"

import { RootState } from "../../../redux"
import { Button } from "polyvolve-ui/lib"

import Link from "next/link"

import { ReviewMasterGlobalActions } from "../../../redux/review/master"
import { ReviewMasterCreateActions } from "../../../redux/review/master/creation"
import ReviewMasterCreation from "./ReviewMasterCreation"
import { SchemaActions } from "../../../redux/schema"
import {
  overviewStyle,
  reviewMasterOverviewStyle,
} from "../../../lib/reexports"
import SortableOverview from "../../utils/SortableOverview"
import { ReviewMaster, ReviewSchema } from "polyvolve-ui/lib/@types"

interface Props {
  loading: boolean
  initialized: boolean
  updated: boolean
  all: ReviewMaster[]
  error?: string
  reviewMasterCreateActions?: typeof ReviewMasterCreateActions
  reviewMasterActions?: typeof ReviewMasterGlobalActions
  schemaActions?: typeof SchemaActions
  createInitialized: boolean
  createError?: string
  schemas?: ReviewSchema[]
}

interface State {
  showReviewMasterCreate: boolean
}

class ReviewMasterView extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = { createError: "" }

  constructor(props: Props) {
    super(props)

    this.state = { showReviewMasterCreate: false }
  }

  componentDidMount() {
    this.props.reviewMasterActions!.loadReviewMastersRequest({})
  }

  componentDidUpdate(oldProps: Props) {
    const newProps = this.props

    if (oldProps.createInitialized !== newProps.createInitialized) {
      this.props.reviewMasterActions!.loadReviewMastersRequest({})

      this.hideReviewMasterCreate()
    }

    if (!oldProps.updated && newProps.updated) {
      this.props.reviewMasterActions!.loadReviewMastersRequest({})
    }
  }

  showReviewMasterCreate = () => this.setState({ showReviewMasterCreate: true })
  hideReviewMasterCreate = () =>
    this.setState({ showReviewMasterCreate: false })

  render(): JSX.Element {
    const {
      all,
      initialized,
      loading,
      reviewMasterCreateActions,
      schemas,
      createError,
      schemaActions,
    } = this.props

    return initialized ? (
      <div className={reviewMasterOverviewStyle.reviewMasterView}>
        <h1 className={overviewStyle.pageTitle}>Review master overview</h1>
        <SortableOverview<ReviewMaster>
          filters={[{ name: "Name", filterItem: () => [] }]}
          items={all}
          renderItem={reviewMaster => (
            <div className={overviewStyle.listItem}>
              <div className={overviewStyle.rowItem}>
                <Link
                  key={`reviewMaster-list-item-${reviewMaster.id}-name`}
                  href={`/review/master/[reviewMasterId]`}
                  as={`/review/master/${reviewMaster.id}`}>
                  <a>{reviewMaster.name}</a>
                </Link>
              </div>
            </div>
          )}
        />
        <div className={overviewStyle.buttonBarWithAdd}>
          <Button name="add-reviewMaster" onClick={this.showReviewMasterCreate}>
            Add new Review
          </Button>
        </div>
        <ReviewMasterCreation
          actions={reviewMasterCreateActions!}
          schemaActions={schemaActions!}
          schemas={schemas}
          show={this.state.showReviewMasterCreate}
          positionRef={null}
          onClose={this.hideReviewMasterCreate}
          error={createError}
          loading={loading}
        />
      </div>
    ) : null
  }
}

function mapStateToProps(state: RootState): Props {
  return {
    loading: state.review.master.global.loading,
    initialized: state.review.master.global.initialized,
    createInitialized: state.review.master.creation.initialized,
    createError: state.review.master.creation.error,
    error: state.review.master.global.error,
    updated: state.review.master.global.updated,
    all: state.review.master.global.all,
    schemas: state.schema.editor.schemas,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    reviewMasterActions: bindActionCreators(
      ReviewMasterGlobalActions,
      dispatch
    ),
    reviewMasterCreateActions: bindActionCreators(
      ReviewMasterCreateActions,
      dispatch
    ),
    schemaActions: bindActionCreators(SchemaActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewMasterView)

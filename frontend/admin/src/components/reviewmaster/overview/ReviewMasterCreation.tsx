import * as React from "react"
import { Modal, Error } from "polyvolve-ui/lib"
import { Formik } from "formik"

import { ReviewMasterCreateActions } from "../../../redux/review/master/creation"

import ReviewMasterCreateForm from "./ReviewMasterCreationForm"
import { SchemaActions } from "../../../redux/schema"
import { IntervalType, ReviewSchema } from "polyvolve-ui/lib/@types"
import { modalStyle } from "../../../lib/reexports"

interface Props {
  show: boolean
  error: string
  onClose: () => void
  loading: boolean
  positionRef: any
  actions: typeof ReviewMasterCreateActions
  schemaActions: typeof SchemaActions
  schemas: ReviewSchema[]
}

interface State {
  submitted: boolean
}

export interface ReviewMasterCreateFormData {
  name?: string
  description?: string
  periodStart?: string
  periodEnd?: string
  dueAt?: string
  interval?: number
  intervalType?: IntervalType
  recursFirstOn?: string
  schema?: { value: string; label: string }
}

export interface ReviewMasterCreateFormErrors {
  name?: string
  description?: string
  periodStart?: string
  periodEnd?: string
  dueAt?: string
  scope?: string
  interval?: string
  schema?: string
}

class ReviewMasterCreation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      submitted: false,
    }
  }

  // TODO elaborate
  validate = (
    values: ReviewMasterCreateFormData
  ): ReviewMasterCreateFormErrors => {
    const errors: ReviewMasterCreateFormErrors = {}

    if (!values.name) {
      errors.name = "Please specify the name of the new review."
    }

    if (!values.periodStart) {
      errors.periodStart = "Please specify the start of the period."
    }

    if (!values.periodEnd) {
      errors.periodEnd = "Please specify the end of the period."
    }

    if (!values.dueAt) {
      errors.dueAt = "Please specify the finalization date."
    }

    if (values.interval === 0) {
      errors.interval = "Minimum value is 0."
    } else if (!values.interval) {
      errors.interval = "Please specify how often the review should recur."
    } else if (values.interval < 0) {
      errors.interval = "Value may not be negative."
    }

    if (!values.schema) {
      errors.schema = "Please specify the schema the reviews should use."
    }

    return errors
  }

  onSubmit = (
    values: ReviewMasterCreateFormData,
    { setSubmitting }: { setSubmitting: (value: boolean) => void }
  ) => {
    this.setState({ submitted: true })

    const newValues: any = { ...values }

    newValues.schemaId = values.schema.value
    delete newValues.schema

    this.props.actions.createReviewMasterRequest(newValues)

    setSubmitting(false)
  }

  componentDidMount() {
    this.props.schemaActions.getSchemasRequest()
  }

  render(): JSX.Element {
    const { show, onClose, loading, error, schemas } = this.props

    return (
      <Modal
        isOpen={show}
        onRequestClose={onClose}
        center={false}
        overlayClassName={modalStyle.modalOverlay}
        className={modalStyle.modal}>
        <Formik<ReviewMasterCreateFormData>
          initialValues={{
            name: "",
            dueAt: "",
            periodStart: "",
            periodEnd: "",
            interval: 1,
            intervalType: "Singular",
            recursFirstOn: "",
          }}
          validate={this.validate}
          onSubmit={this.onSubmit}
          render={formikProps => (
            <ReviewMasterCreateForm
              schemas={schemas}
              error={error}
              loading={loading}
              {...formikProps}
            />
          )}
        />
      </Modal>
    )
  }
}

export default ReviewMasterCreation

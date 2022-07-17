import * as React from "react"
import { Modal, Error, LoadButton } from "polyvolve-ui/lib"
import { Formik } from "formik"
import cx from "classnames"

import { TeamCreationActions } from "../../../redux/team"
import { modalStyle } from "../../../lib/reexports"
import PInput from "../../ui/PInput"

interface Props {
  show: boolean
  onClose: () => void
  loading: boolean
  positionRef: any
  actions: typeof TeamCreationActions
}

interface TeamCreationFormData {
  name?: string
  description?: string
}

type TeamCreationFormErrors = TeamCreationFormData

class TeamCreation extends React.Component<Props> {
  validate = (values: TeamCreationFormData): TeamCreationFormErrors => {
    const errors: TeamCreationFormErrors = {}

    if (!values.name) {
      errors.name = "Missing name."
    }

    return errors
  }

  onSubmit = (
    values: TeamCreationFormData,
    { setSubmitting }: { setSubmitting: (value: boolean) => void }
  ) => {
    this.setState({ submitted: true })

    this.props.actions.createTeamRequest(values)

    setSubmitting(false)
  }

  render(): JSX.Element {
    const { show, onClose, loading } = this.props

    // TODO external form error is not included here.

    return (
      <Modal
        isOpen={show}
        onRequestClose={onClose}
        center={false}
        overlayClassName={modalStyle.modalOverlay}
        className={modalStyle.modal}>
        <Formik<TeamCreationFormData>
          initialValues={{ name: "" }}
          validate={this.validate}
          onSubmit={this.onSubmit}
          render={({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form
              className={cx(modalStyle.modalForm, modalStyle.modalInner)}
              onSubmit={handleSubmit}>
              <div className={modalStyle.modalFormRow}>
                <label>Name</label>
                <PInput
                  name="name"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
              </div>
              {touched.name && errors.name && <Error>{errors.name}</Error>}
              <div className={modalStyle.modalFormRow}>
                <label>Description</label>
                <textarea
                  name="description"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.description}
                />
              </div>
              {touched.description && errors.description && (
                <Error>{errors.description}</Error>
              )}
              <div>
                <LoadButton
                  type="submit"
                  loading={loading}
                  disabled={isSubmitting}>
                  Submit
                </LoadButton>
              </div>
            </form>
          )}
        />
      </Modal>
    )
  }
}

export default TeamCreation

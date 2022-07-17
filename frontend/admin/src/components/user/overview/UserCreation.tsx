import * as React from "react"
import { Modal, Error, LoadButton } from "polyvolve-ui/lib"
import { Formik } from "formik"

import { cx, componentStyle, Select, modalStyle } from "../../../lib/reexports"
import { UserCreationActions } from "../../../redux/user/creation"
import { Sex } from "polyvolve-ui/lib/@types"
import { customStyles } from "../../../lib/customStyles"
import PInput from "../../ui/PInput"

interface Props {
  show: boolean
  onClose: () => void
  loading: boolean
  userCreationActions: typeof UserCreationActions
}

interface UserCreationFormData {
  name?: string
  surname?: string
  mail?: string
  position?: string
  sex?: { value: Sex; label: string }
}

interface UserCreationFormErrors {
  name?: string
  surname?: string
  mail?: string
  position?: string
  sex?: string
}

class UserCreation extends React.Component<Props> {
  validate = (values: UserCreationFormData): UserCreationFormErrors => {
    const errors: UserCreationFormErrors = {}

    if (!values.mail) {
      errors.mail = "Missing mail."
    }

    if (!values.name) {
      errors.name = "Missing name."
    }

    if (!values.surname) {
      errors.surname = "Missing surname."
    }

    if (!values.position) {
      errors.position = "Missing position."
    }

    if (!values.sex) {
      errors.sex = "Missing sex."
    }

    return errors
  }

  onSubmit = (
    values: UserCreationFormData,
    { setSubmitting }: { setSubmitting: (value: boolean) => void }
  ) => {
    const { userCreationActions } = this.props

    this.setState({ submitted: true })

    const valuesAdjusted: any = { ...values }
    valuesAdjusted.sex = values.sex.value

    userCreationActions.addUserRequest(valuesAdjusted)

    setSubmitting(false)
  }

  render(): JSX.Element {
    const { show, onClose, loading } = this.props

    return (
      <Modal
        isOpen={show}
        onRequestClose={onClose}
        center={false}
        overlayClassName={modalStyle.modalOverlay}
        className={modalStyle.modal}>
        <Formik<UserCreationFormData>
          initialValues={{ name: "", surname: "", mail: "", position: "" }}
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
            setFieldTouched,
            setFieldValue,
          }) => (
            <form
              className={cx(modalStyle.modalForm, modalStyle.modalInner)}
              onSubmit={handleSubmit}>
              <div className={modalStyle.modalFormRow}>
                <label>Mail</label>
                <PInput
                  className={modalStyle.modalFormInput}
                  name="mail"
                  type="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.mail}
                />
              </div>
              {touched.mail && errors.mail && <Error>{errors.mail}</Error>}
              <div className={modalStyle.modalFormRow}>
                <label>Name</label>
                <PInput
                  className={modalStyle.modalFormInput}
                  name="name"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
              </div>
              {touched.name && errors.name && <Error>{errors.name}</Error>}
              <div className={modalStyle.modalFormRow}>
                <label>Surname</label>
                <PInput
                  className={modalStyle.modalFormInput}
                  name="surname"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.surname}
                />
              </div>
              {touched.surname && errors.surname && (
                <Error>{errors.surname}</Error>
              )}
              <div className={modalStyle.modalFormRow}>
                <label>Position</label>
                <PInput
                  className={modalStyle.modalFormInput}
                  name="position"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.position}
                />
              </div>
              {touched.position && errors.position && (
                <Error>{errors.position}</Error>
              )}
              <div className={modalStyle.modalFormRow}>
                <label>Sex</label>
                <Select
                  styles={customStyles}
                  className={cx(
                    componentStyle.select,
                    modalStyle.modalFormInput
                  )}
                  classNamePrefix="pv"
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                  placeholder={"Sex"}
                  value={values.sex}
                  onBlur={() => setFieldTouched("sex")}
                  onChange={wrapper => setFieldValue("sex", wrapper)}
                />
              </div>
              {touched.position && errors.position && (
                <Error>{errors.position}</Error>
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

export default UserCreation

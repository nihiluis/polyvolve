import * as React from "react"
import { Formik } from "formik"
import { SchemaActions } from "../../redux/schema"
import { InfoIcon } from "polyvolve-ui/lib/icons";
import { Error, Button, LoadButton } from "polyvolve-ui/lib";
import { modalStyle, cx, formStyle } from "../../lib/reexports";
import * as schemaStyle from "../../style/schema.module.scss"
import * as helpIcon from "../../assets/icons/help.svg"
import { ReviewSchema } from "polyvolve-ui/lib/@types"
import PInput from "../ui/PInput"

interface Props {
  schemaActions: typeof SchemaActions
  show: boolean
  schema: ReviewSchema
  onSubmit: () => void
  onClose: () => void
  error: string
  loading: boolean
  initialized: boolean
}

interface FormData {
  name: string
  description: string
}

interface FormErrors {
  name?: string
  description?: string
}

class SchemaAddCategory extends React.Component<Props> {
  componentDidUpdate(oldProps: Props) {
    const newProps = this.props
    if (!oldProps.initialized && newProps.initialized && !newProps.error) {
      this.props.onClose()
    }
  }

  validate(values: FormData): FormErrors {
    const { name, description } = values
    const errors: FormErrors = {}

    if (!name) {
      errors.name = "Name must not be empty."
    }

    if (!description) {
      errors.description = "Description must not be empty."
    }

    return errors
  }

  onSubmit = (values: FormData) => {
    const { schema } = this.props
    const { name, description } = values

    this.props.schemaActions.createCategoryRequest({ schema, name, description })
    this.props.onSubmit()
  }

  render(): JSX.Element {
    const { error, loading, show, onClose } = this.props

    return (
      <Formik<FormData>
        initialValues={{ name: "", description: "" }}
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
        }) => !show ? null : (
          <form className={schemaStyle.schemaAddCategory} onSubmit={handleSubmit}>
            <div className={formStyle.formRowContainer}>
              <div className={formStyle.formRowGrid}>
                <label>Topic</label>
                <div className={formStyle.formRowInputContainer}>
                  <PInput
                    name="name"
                    type="text"
                    className={modalStyle.modalFormInput}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name} />
                  <InfoIcon
                    src={helpIcon}
                    size={16}
                    tooltip="Name the topic of the review master succinctly." />
                </div>
              </div>
              {touched.name && errors.name && <Error>{errors.name}</Error>}
            </div>
            <div className={formStyle.formRowContainer}>
              <div className={formStyle.formRowGrid}>
                <label>Description</label>
                <div className={formStyle.formRowInputContainer}>
                  <textarea
                    name="description"
                    className={modalStyle.modalFormInput}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description} />
                  <InfoIcon
                    src={helpIcon}
                    size={16}
                    tooltip="Describe the topic more elaborately, if needed." />
                </div>
              </div>
              {touched.description && errors.description && <Error>{errors.description}</Error>}
            </div>
            <div className={formStyle.formButtonBar}>
              <LoadButton
                type="submit"
                name="add-category-save"
                loading={loading}
                disabled={isSubmitting}>Submit</LoadButton>
              <Button type="button" name="add-category-cancel" onClick={onClose}>Cancel</Button>
            </div>
          </form>
        )}
      />
    )
  }
}

export default SchemaAddCategory

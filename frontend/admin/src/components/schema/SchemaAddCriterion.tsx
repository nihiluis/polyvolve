import * as React from "react"
import { Formik } from "formik"
import { SchemaActions } from "../../redux/schema"
import { InfoIcon } from "polyvolve-ui/lib/icons"
import { Error, Button, LoadButton } from "polyvolve-ui/lib"
import {
  modalStyle,
  cx,
  formStyle,
  Select,
  componentStyle,
  style,
} from "../../lib/reexports"
import * as schemaStyle from "../../style/schema.module.scss"
import * as helpIcon from "../../assets/icons/help.svg"
import { ReviewCategory } from "polyvolve-ui/lib/@types"
import PInput from "../ui/PInput"

interface Props {
  category: ReviewCategory
  schemaActions: typeof SchemaActions
  show: boolean
  onSubmit: () => void
  onClose: () => void
  error: string
  loading: boolean
  initialized: boolean
}

interface FormData {
  name: string
  description: string
  type: string
}

interface FormErrors {
  name?: string
  description?: string
  type?: string
}

class SchemaAddCriterion extends React.Component<Props> {
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
    const { category } = this.props
    const { name, description, type } = values

    this.props.schemaActions.createCriterionRequest({
      category,
      name,
      description,
      type,
    })
    this.props.onSubmit()
  }

  labelForValue = (value: string): string =>
    value.charAt(0).toUpperCase() + value.slice(1)

  render(): JSX.Element {
    const { error, loading, show, onClose } = this.props

    return (
      <Formik<FormData>
        initialValues={{ name: "", description: "", type: "scale" }}
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
          setFieldValue,
          setFieldTouched,
        }) =>
          !show ? null : (
            <form
              className={schemaStyle.schemaAddCriteiron}
              onSubmit={handleSubmit}>
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
                      value={values.name}
                    />
                    <InfoIcon
                      src={helpIcon}
                      size={16}
                      tooltip="Name the topic of the review master succinctly."
                    />
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
                      value={values.description}
                    />
                    <InfoIcon
                      src={helpIcon}
                      size={16}
                      tooltip="Describe the topic more elaborately, if needed."
                    />
                  </div>
                </div>
                {touched.description && errors.description && (
                  <Error>{errors.description}</Error>
                )}
              </div>
              <div className={formStyle.formRowContainer}>
                <div className={formStyle.formRowGrid}>
                  <label>Type</label>
                  <div className={formStyle.formRowInputContainer}>
                    <Select
                      className={cx(
                        style.selectMenu,
                        componentStyle.select,
                        style.widthInputSmall
                      )}
                      classNamePrefix="pv"
                      placeholder={{
                        value: values.type,
                        label: this.labelForValue(values.type),
                      }}
                      value={{
                        value: values.type,
                        label: this.labelForValue(values.type),
                      }}
                      onBlur={() => setFieldTouched("type", true)}
                      onChange={value => setFieldValue("type", value.value)}
                      options={[
                        { value: "scale", label: "Scale" },
                        { value: "text", label: "Text" },
                      ]}
                    />
                    <InfoIcon
                      src={helpIcon}
                      size={16}
                      tooltip="Describe the topic more elaborately, if needed."
                    />
                  </div>
                </div>
              </div>
              <div className={formStyle.formButtonBar}>
                <LoadButton
                  type="submit"
                  name="add-category-save"
                  loading={loading}
                  disabled={isSubmitting}>
                  Submit
                </LoadButton>
                <Button
                  type="button"
                  name="add-category-cancel"
                  onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          )
        }
      />
    )
  }
}

export default SchemaAddCriterion

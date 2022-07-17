import * as React from "react"
import { FormikProps } from "formik"

import { Button, Error } from "polyvolve-ui/lib"

import { FormDataBasic } from "./SchemaCategory"
import SectionButtonBar from "../ui/section/SectionButtonBar"
import { formStyle, singleStyle } from "../../lib/reexports"
import PInput from "../ui/PInput"

interface Props extends FormikProps<FormDataBasic> {
  toggleEditting: () => void
}

const SchemaCategoryInformationEdit: React.FunctionComponent<Props> = props => {
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
    toggleEditting,
  } = props

  return (
    <form onSubmit={handleSubmit}>
      <div className={formStyle.formRow}>
        <div className={singleStyle.informationFormItem}>
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
      </div>
      <div className={formStyle.formRow}>
        <div className={singleStyle.informationFormItem}>
          <label>Description</label>
          <textarea
            name="description"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.description}
          />
        </div>
      </div>
      <SectionButtonBar>
        <Button type="button" name="info-cancel" onClick={toggleEditting}>
          Cancel
        </Button>
        <Button type="submit" name="info-save" disabled={isSubmitting}>
          Save
        </Button>
      </SectionButtonBar>
    </form>
  )
}

export default SchemaCategoryInformationEdit

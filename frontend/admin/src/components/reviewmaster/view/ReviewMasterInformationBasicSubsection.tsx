import * as React from "react"
import { FormikProps } from "formik"
import Toggle from "react-toggle"

import SectionButtonBar from "../../ui/section/SectionButtonBar"
import { Button, Error } from "polyvolve-ui/lib"

import { FormDataBasic } from "./ReviewMasterInformationSection"
import { singleStyle, formStyle } from "../../../lib/reexports"
import PInput from "../../ui/PInput"

interface Props extends FormikProps<FormDataBasic> {
  toggleEditting: () => void
}

const ReviewMasterInformationBasicSubsection: React.FunctionComponent<Props> = props => {
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
      <div className={formStyle.formRow}>
        <div className={singleStyle.informationFormItem}>
          <label>Is active</label>
          <Toggle name="isActive" defaultChecked={values.isActive} onChange={handleChange} />
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

export default ReviewMasterInformationBasicSubsection

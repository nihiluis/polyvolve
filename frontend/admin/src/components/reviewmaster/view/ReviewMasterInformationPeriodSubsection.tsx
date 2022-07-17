import * as React from "react"
import Select from "react-select"
import cx from "classnames"
import { FormikProps } from "formik"

import SectionButtonBar from "../../ui/section/SectionButtonBar"
import { Button, Error, SelectButtonMenu } from "polyvolve-ui/lib"

import { FormDataPeriod } from "./ReviewMasterInformationSection"
import { getRecurInfoText } from "../../../lib/date"
import DateHandler, { IntervalTypeSelectMenuItem } from "./DateHandler"
import { formStyle, singleStyle, componentStyle, reviewMasterOverviewStyle } from "../../../lib/reexports"
import PInput from "../../ui/PInput"

const selectOptions = [
  { value: "Singular", label: "Singular" },
  { value: "Recurring", label: "Recurring" },
]

interface Props extends FormikProps<FormDataPeriod> {
  toggleEditting: () => void
}

class ReviewMasterInformationPeriodSubsection extends DateHandler<
  FormDataPeriod,
  Props,
  {}
> {
  updateActiveType = (type: "Recurring" | "Singular") => {
    this.props.setFieldValue("activeType", type)

    if (type === "Singular") {
      this.handleIntervalTypeChange(type)
    } else if (type === "Recurring") {
      this.handleIntervalTypeChange(this.props.values.intervalType)
    }
  }

  render(): JSX.Element {
    const {
      values,
      handleChange,
      handleBlur,
      handleSubmit,
      errors,
      touched,
      setFieldValue,
      isSubmitting,
      toggleEditting,
    } = this.props

    const isRecurring = values.activeType === "Recurring"

    return (
      <form onSubmit={handleSubmit}>
        <div className={formStyle.formRow}>
          <div className={singleStyle.informationFormItem}>
            <label>Singular or recurring</label>
            <Select
              className={cx(
                singleStyle.informationFormSelect,
                componentStyle.select
              )}
              classNamePrefix="pv"
              options={selectOptions}
              placeholder={values.activeType}
              value={values.activeType}
              onChange={({ value }) => this.updateActiveType(value)}
            />
          </div>
          {touched.activeType && errors.activeType && (
            <Error>{errors.activeType}</Error>
          )}
        </div>
        {isRecurring && (
          <React.Fragment>
            <div className={formStyle.formRow}>
              <div className={singleStyle.informationFormItem}>
                <label>Interval</label>
                <PInput
                  name="interval"
                  type="number"
                  min={1}
                  max={365}
                  onChange={this.handleRecurChange}
                  onBlur={handleBlur}
                  value={values.interval}
                />
              </div>
              {touched.interval && errors.interval && (
                <Error>{errors.interval}</Error>
              )}
              {(touched.interval || values.interval >= 1) &&
                !errors.interval && (
                  <p>
                    {getRecurInfoText(
                      values.intervalType,
                      values.periodStart,
                      values.interval
                    )}
                  </p>
                )}
            </div>
            <div className={formStyle.formRow}>
              <div className={singleStyle.informationFormItem}>
                <label>Recurs</label>
                {/*
              <Select
                className={cx(style.informationFormSelect, componentStyle.select)}
                classNamePrefix="pv"
                options={selectOptions}
                placeholder={values.activeType}
                value={values.activeType}
                onChange={value => setFieldValue("activeType", value)} />
              */}
                <SelectButtonMenu<IntervalTypeSelectMenuItem>
                  value={values.intervalType}
                  onClick={this.updateIntervalType}
                  onUpdate={() => {}}
                  className={cx(
                    reviewMasterOverviewStyle.intervalTypeSelectionMenu,
                    singleStyle.selectMenu
                  )}
                  itemClassName={cx(
                    reviewMasterOverviewStyle.intervalTypeSelectionMenuButton,
                    singleStyle.selectMenuItem
                  )}
                  items={[
                    { name: "Weekly" },
                    { name: "Monthly" },
                    { name: "Annually" },
                  ]}
                />
              </div>
            </div>
          </React.Fragment>
        )}
        <div className={formStyle.formRow}>
          <div className={singleStyle.informationFormItem}>
            <label>Period start</label>
            <PInput
              name="periodStart"
              type="date"
              onChange={this.handlePeriodStartChange}
              onBlur={handleBlur}
              value={values.periodStart}
            />
          </div>
          {touched.periodStart && errors.periodStart && (
            <Error>{errors.periodStart}</Error>
          )}
        </div>
        <div className={formStyle.formRow}>
          <div className={singleStyle.informationFormItem}>
            <label>Period end</label>
            <PInput
              name="periodEnd"
              type="date"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.periodEnd}
            />
          </div>
          {touched.periodEnd && errors.periodEnd && (
            <Error>{errors.periodEnd}</Error>
          )}
        </div>
        <div className={formStyle.formRow}>
          <div className={singleStyle.informationFormItem}>
            <label>Due at</label>
            <PInput
              name="dueAt"
              type="date"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.dueAt}
            />
          </div>
        </div>
        {touched.dueAt && errors.dueAt && <Error>{errors.dueAt}</Error>}
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
}

export default ReviewMasterInformationPeriodSubsection

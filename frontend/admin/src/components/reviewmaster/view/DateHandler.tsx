import * as React from "react"

import { FormikProps } from "formik"
import { recommendDate } from "../../../lib/date"
import { SelectButtonMenuItem } from "polyvolve-ui/lib/nav/SelectButtonMenu"
import { IntervalType } from "polyvolve-ui/lib/@types"

interface DateValues {
  periodStart?: string
  periodEnd?: string
  dueAt?: string
  interval?: number
  intervalType?: IntervalType
}

export interface DateProps<Values extends DateValues>
  extends FormikProps<Values> {}

export interface IntervalTypeSelectMenuItem extends SelectButtonMenuItem {
  name: IntervalType
}

class DateHandler<
  Values extends DateValues,
  Props extends DateProps<Values>,
  State
> extends React.Component<Props, State> {
  areDatesUntouched = (): boolean => {
    const { periodStart, periodEnd, dueAt } = this.props.touched

    return !periodStart && !periodEnd && !dueAt
  }

  handleRecurChange = (event: React.ChangeEvent<any>) => {
    const { handleChange } = this.props

    if (this.areDatesUntouched()) {
      this.updateValuesOnChange(event.target.value)
    }

    handleChange(event)
  }

  handleIntervalTypeChange = (newIntervalType: IntervalType) => {
    const { values, setFieldValue } = this.props

    setFieldValue("intervalType", newIntervalType)

    if (values.periodStart)
      this.updateValuesOnChange(values.interval, newIntervalType)
    else this.updateValuesOnChange(values.interval)
  }

  handlePeriodStartChange = (event: React.ChangeEvent<any>) => {
    const { handleChange, values, touched } = this.props

    const { periodEnd } = touched
    if (!periodEnd) {
      this.updateValuesOnChange(
        values.interval,
        values.intervalType,
        event.target.value
      )
    }

    handleChange(event)
  }

  updateValuesOnChange = (
    interval?: number,
    intervalType: IntervalType = this.props.values.intervalType,
    periodStart?: string
  ) => {
    const { setFieldValue } = this.props

    if (!interval) return
    if (intervalType === "Singular") return

    const recommendedDates = recommendDate(interval, intervalType, periodStart)

    setFieldValue(
      "periodStart",
      recommendedDates.periodStart.format("YYYY-MM-DD")
    )
    setFieldValue("periodEnd", recommendedDates.periodEnd.format("YYYY-MM-DD"))
    setFieldValue("dueAt", recommendedDates.dueAt.format("YYYY-MM-DD"))
    setFieldValue(
      "recursFirstOn",
      recommendedDates.recursFirstOn.format("YYYY-MM-DD")
    )
  }

  handleResetDatesTouched = () => {
    const { setFieldTouched } = this.props

    setFieldTouched("periodStart", false)
    setFieldTouched("periodEnd", false)
    setFieldTouched("dueAt", false)
    setFieldTouched("recursFirstOn", false)
  }

  updateIntervalType = (name: IntervalTypeSelectMenuItem) =>
    this.props.setFieldValue("intervalType", name.name)
}

export default DateHandler

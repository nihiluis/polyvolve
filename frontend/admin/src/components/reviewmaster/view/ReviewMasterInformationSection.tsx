import * as React from "react"
import cx from "classnames"
import { Formik } from "formik"

import SectionTitle from "../../ui/section/SectionTitle"
import Section from "../../ui/section/Section"
import SectionInformation from "../../ui/section/SectionInformation"
import SectionHeader from "../../ui/section/SectionHeader"
import Subsection from "../../ui/section/Subsection"
import SubsectionTitle from "../../ui/section/SubsectionTitle"

import ReviewMasterInformationPeriodSubsection from "./ReviewMasterInformationPeriodSubsection"
import ReviewMasterInformationBasicSubsection from "./ReviewMasterInformationBasicSubsection"
import SubsectionContent from "../../ui/section/SubsectionContent"
import SectionContent from "../../ui/section/SectionContent"
import SubsectionEditButton from "../../ui/section/SubsectionEditButton"
import {
  IntervalType,
  ReviewMaster,
  ReviewMasterContainerType,
  ReviewMasterType,
} from "polyvolve-ui/lib/@types"
import { singleStyle } from "../../../lib/reexports"

interface UpdateReviewMasterParams {
  id?: string
  name?: string
  description?: string
  interval?: number
  intervalType?: IntervalType
  periodStart?: string
  periodEnd?: string
  dueAt?: string
}

interface Props {
  reviewMaster: ReviewMaster
  loading: boolean
  updateReviewMaster: (params: UpdateReviewMasterParams) => void
}

interface State {
  edittingBasic: boolean
  edittingPeriod: boolean
  submitted: boolean
}

export interface FormDataPeriod {
  activeType: ReviewMasterContainerType
  interval: number
  intervalType: IntervalType
  periodStart: string
  periodEnd: string
  dueAt: string
}

export interface FormErrorsPeriod {
  type?: ReviewMasterType
  interval?: number
  intervalType?: IntervalType
  periodStart?: string
  periodEnd?: string
  dueAt?: string
}

export interface FormDataBasic {
  name: string
  description: string
  isActive: boolean
}

export interface FormErrorsBasic {
  name?: string
  description?: string
}

class ReviewMasterInformationSection extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      edittingBasic: false,
      edittingPeriod: false,
      submitted: false,
    }
  }

  toggleEdittingBasic = () => {
    const newEdittingState = !this.state.edittingBasic

    this.setState({ edittingBasic: newEdittingState })
  }

  toggleEdittingPeriod = () => {
    const newEdittingState = !this.state.edittingPeriod

    this.setState({ edittingPeriod: newEdittingState })
  }

  validatePeriod = (values: FormDataPeriod): FormErrorsPeriod => {
    const errors: FormErrorsPeriod = {}

    return errors
  }

  validateBasic = (values: FormDataBasic): FormErrorsBasic => {
    const errors: FormErrorsBasic = {}

    if (!values.name) {
      errors.name = "Missing name."
    }

    return errors
  }

  onSubmit = (
    values: FormDataPeriod | FormDataBasic,
    { setSubmitting }: { setSubmitting: (value: boolean) => void }
  ) => {
    const { reviewMaster, updateReviewMaster } = this.props
    this.setState({ submitted: true, edittingBasic: false })

    console.log("updating values")
    console.log(values)
    updateReviewMaster({ id: reviewMaster.id, ...values })

    setSubmitting(false)
  }

  render(): JSX.Element {
    const { reviewMaster } = this.props
    const { edittingBasic, edittingPeriod } = this.state

    return (
      <React.Fragment>
        <Section size="full">
          <SectionHeader>
            <SectionTitle title="Information" size="full" />
          </SectionHeader>
          <SectionContent size="full">
            <Subsection
              size="full"
              className={cx({ [singleStyle.isEditting]: edittingBasic })}>
              <SubsectionTitle title="Basic" />
              <SubsectionContent size="full">
                {!edittingBasic && (
                  <SectionInformation
                    items={[
                      { name: "Name:", value: reviewMaster.name },
                      { name: "Description:", value: reviewMaster.description },
                      {
                        name: "Schema:",
                        value: reviewMaster.schema.name || "Unknown",
                      },
                      {
                        name: "Is active:",
                        value: reviewMaster.status === "Active" ? "Yes" : "No",
                      },
                    ]}
                  />
                )}
                {edittingBasic && (
                  <Formik<FormDataBasic>
                    initialValues={{
                      name: reviewMaster.name || "",
                      description: reviewMaster.description || "",
                      isActive: reviewMaster.status === "Active" || false,
                    }}
                    validate={this.validateBasic}
                    onSubmit={this.onSubmit}
                    render={formikProps => (
                      <ReviewMasterInformationBasicSubsection
                        {...formikProps}
                        toggleEditting={this.toggleEdittingBasic}
                      />
                    )}
                  />
                )}
              </SubsectionContent>
              <SubsectionEditButton
                name="basic-edit"
                toggleEditting={this.toggleEdittingBasic}
                editting={edittingBasic}
              />
            </Subsection>
            <Subsection
              size="full"
              className={cx({ [singleStyle.isEditting]: edittingPeriod })}>
              <SubsectionTitle title="Period" />
              <SubsectionContent size="full">
                {!edittingPeriod && (
                  <SectionInformation
                    items={[
                      {
                        name: "Type:",
                        value:
                          reviewMaster.intervalType === "Singular"
                            ? "Singular"
                            : "Recurring",
                      },
                      {
                        name: "Interval:",
                        value: reviewMaster.interval.toString(),
                      },
                      {
                        name: "Interval type:",
                        value: reviewMaster.intervalType,
                      },
                      {
                        name: "Period start:",
                        value: reviewMaster.periodStart.format("YYYY-MM-DD"),
                      },
                      {
                        name: "Period end:",
                        value: reviewMaster.periodEnd.format("YYYY-MM-DD"),
                      },
                      {
                        name: "Due at:",
                        value: reviewMaster.dueAt.format("YYYY-MM-DD"),
                      },
                    ]}
                  />
                )}
                {edittingPeriod && (
                  <Formik<FormDataPeriod>
                    initialValues={{
                      activeType:
                        (reviewMaster.intervalType || "Singular") !== "Singular"
                          ? "Recurring"
                          : "Singular",
                      interval: reviewMaster.interval || 1,
                      intervalType: reviewMaster.intervalType || "Monthly",
                      periodStart:
                        reviewMaster.periodStart.format("YYYY-MM-DD") || "",
                      periodEnd:
                        reviewMaster.periodEnd.format("YYYY-MM-DD") || "",
                      dueAt: reviewMaster.dueAt.format("YYYY-MM-DD") || "",
                    }}
                    validate={this.validatePeriod}
                    onSubmit={this.onSubmit}
                    render={formikProps => (
                      <ReviewMasterInformationPeriodSubsection
                        {...formikProps}
                        toggleEditting={this.toggleEdittingPeriod}
                      />
                    )}
                  />
                )}
              </SubsectionContent>
              <SubsectionEditButton
                name="period-edit"
                toggleEditting={this.toggleEdittingPeriod}
                editting={edittingPeriod}
              />
            </Subsection>
          </SectionContent>
        </Section>
      </React.Fragment>
    )
  }
}

export default ReviewMasterInformationSection

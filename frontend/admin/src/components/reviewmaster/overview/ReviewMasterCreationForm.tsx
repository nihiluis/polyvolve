import * as React from "react"
import {
  Error,
  LoadButton,
  MultiSelectButtonMenu,
  SelectButtonMenu,
  Wizard,
  WizardPage,
  WizardPageSelect,
} from "polyvolve-ui/lib"
import { FormikProps } from "formik"
import cx from "classnames"

import * as resetIcon from "../../../assets/icons/reset.svg"
import * as helpIcon from "../../../assets/icons/help.svg"
import { ReviewMasterCreateFormData } from "./ReviewMasterCreation"
import { Icon, InfoIcon } from "polyvolve-ui/lib/icons"
import { SelectButtonMenuItem } from "polyvolve-ui/lib/nav/SelectButtonMenu"
import { formatRecur, getRecurInfoText } from "../../../lib/date"
import DateHandler, { IntervalTypeSelectMenuItem } from "../view/DateHandler"
import {
  Select,
  componentStyle,
  modalStyle,
  reviewMasterOverviewStyle,
  overviewStyle,
} from "../../../lib/reexports"
import {
  ReviewMasterContainerType,
  IntervalType,
  ReviewSchema,
} from "polyvolve-ui/lib/@types"
import PInput from "../../ui/PInput"

interface Props extends FormikProps<ReviewMasterCreateFormData> {
  loading: boolean
  schemas: ReviewSchema[]
  error: string
}

interface State {
  activeType: ReviewMasterContainerType
}

interface ReviewMasterActiveTypeSelectMenuItem extends SelectButtonMenuItem {
  name: ReviewMasterContainerType
}

export default class ReviewMasterCreateForm extends DateHandler<
  ReviewMasterCreateFormData,
  Props,
  State
> {
  constructor(props: Props) {
    super(props)

    this.state = {
      activeType: "Singular",
    }
  }

  updateActiveType = (item: ReviewMasterActiveTypeSelectMenuItem) => {
    this.setState({ activeType: item.name })

    if (item.name === "Singular") {
      this.handleIntervalTypeChange(item.name as IntervalType)
    } else if (item.name === "Recurring") {
      this.handleIntervalTypeChange(this.props.values.intervalType)
    }
  }

  isRecurring = (): boolean => this.state.activeType === "Recurring"

  onUpdateSchema = (schemaWrapper: { value: string; label: string }) =>
    this.props.setFieldValue("schema", schemaWrapper)

  render(): JSX.Element {
    const {
      handleChange,
      handleSubmit,
      handleBlur,
      isSubmitting,
      values,
      touched,
      errors,
      loading,
      schemas,
      error,
    } = this.props

    const formClasses = cx(
      modalStyle.modalForm,
      reviewMasterOverviewStyle.reviewMasterCreateMenu
    )

    return (
      <form className={formClasses} onSubmit={handleSubmit}>
        <Wizard
          maxPage={2}
          render={(wizardProps, switchPage) => (
            <React.Fragment>
              <WizardPage currentPage={wizardProps.page} showWhenPage={1}>
                <div className={reviewMasterOverviewStyle.typeSelection}>
                  <SelectButtonMenu<ReviewMasterActiveTypeSelectMenuItem>
                    value={this.state.activeType}
                    onClick={this.updateActiveType}
                    onUpdate={() => {}}
                    className={
                      reviewMasterOverviewStyle.activeTypeSelectionMenu
                    }
                    itemClassName={
                      reviewMasterOverviewStyle.activeTypeSelectionMenuButton
                    }
                    items={[{ name: "Singular" }, { name: "Recurring" }]}
                  />
                </div>
                <div
                  className={cx(
                    modalStyle.modalInner,
                    overviewStyle.overviewModalInner
                  )}>
                  <div
                    className={cx(
                      modalStyle.modalFormRow,
                      modalStyle.modalFormRowContainer
                    )}>
                    <label>Topic</label>
                    <div className={modalStyle.modalFormInputContainer}>
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
                  <div
                    className={cx(
                      modalStyle.modalFormRow,
                      modalStyle.modalFormRowContainer
                    )}>
                    <label>Description</label>
                    <div className={modalStyle.modalFormInputContainer}>
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
                  {this.isRecurring() && (
                    <div
                      className={cx(
                        reviewMasterOverviewStyle.recurringContainer,
                        modalStyle.modalFormRowContainer
                      )}>
                      <div
                        className={reviewMasterOverviewStyle.recurringOptions}>
                        <label>Recurs</label>
                        <div className={modalStyle.modalFormInputContainer}>
                          <SelectButtonMenu<IntervalTypeSelectMenuItem>
                            value={values.intervalType}
                            onClick={this.updateIntervalType}
                            onUpdate={() => {}}
                            className={cx(
                              reviewMasterOverviewStyle.intervalTypeSelectionMenu,
                              modalStyle.modalFormInput
                            )}
                            itemClassName={
                              reviewMasterOverviewStyle.intervalTypeSelectionMenuButton
                            }
                            items={[
                              { name: "Weekly" },
                              { name: "Monthly" },
                              { name: "Annually" },
                            ]}
                          />
                          <InfoIcon
                            src={helpIcon}
                            size={16}
                            tooltip="Describe at what time unit the master's associated reviews recur."
                          />
                        </div>
                      </div>
                      <div className={modalStyle.modalFormRow}>
                        <label>Interval</label>
                        <div className={modalStyle.modalFormInputContainer}>
                          <PInput
                            name="interval"
                            type="number"
                            min={1}
                            max={365}
                            className={modalStyle.modalFormInput}
                            onChange={this.handleRecurChange}
                            onBlur={handleBlur}
                            value={values.interval}
                          />
                          <InfoIcon
                            src={helpIcon}
                            size={16}
                            tooltip={`This review master will recur every ${formatRecur(
                              values.interval,
                              values.intervalType
                            )} after one day from the end of period onwards.`}
                          />
                        </div>
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
                  )}
                  <div className={modalStyle.modalFormRowContainer}>
                    <div className={modalStyle.modalFormRow}>
                      <label>Start of period</label>
                      <div className={modalStyle.modalFormInputContainer}>
                        <PInput
                          name="periodStart"
                          type="date"
                          className={modalStyle.modalFormInput}
                          onChange={this.handlePeriodStartChange}
                          onBlur={handleBlur}
                          value={values.periodStart}
                        />
                        <InfoIcon
                          src={helpIcon}
                          size={16}
                          tooltip="Marks the start of the period subject to being reviewed."
                        />
                      </div>
                    </div>
                    {touched.periodStart && errors.periodStart && (
                      <Error>{errors.periodStart}</Error>
                    )}
                    <div className={modalStyle.modalFormRow}>
                      <label>End of period</label>
                      <div className={modalStyle.modalFormInputContainer}>
                        <PInput
                          name="periodEnd"
                          type="date"
                          disabled={this.isRecurring()}
                          className={modalStyle.modalFormInput}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.periodEnd}
                        />
                        <InfoIcon
                          src={helpIcon}
                          size={16}
                          tooltip="Marks the end of the period subject to being reviewed."
                        />
                      </div>
                    </div>
                    {touched.periodEnd && errors.periodEnd && (
                      <Error>{errors.periodEnd}</Error>
                    )}
                    <div className={modalStyle.modalFormRow}>
                      <label>Due at</label>
                      <div className={modalStyle.modalFormInputContainer}>
                        <PInput
                          name="dueAt"
                          type="date"
                          className={modalStyle.modalFormInput}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.dueAt}
                        />
                        <InfoIcon
                          src={helpIcon}
                          size={16}
                          tooltip="The last date at which the reviews should have been submitted."
                        />
                      </div>
                    </div>
                    {touched.dueAt && errors.dueAt && (
                      <Error>{errors.dueAt}</Error>
                    )}
                    {this.isRecurring() && (
                      <div className={modalStyle.modalFormRow}>
                        <label>Recurs first on</label>
                        <div className={modalStyle.modalFormInputContainer}>
                          <PInput
                            name="recursFirstOn"
                            type="date"
                            disabled={true}
                            className={modalStyle.modalFormInput}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.recursFirstOn}
                          />
                          <InfoIcon
                            src={helpIcon}
                            size={16}
                            tooltip="The next period start will be on this date and periodically afterwards."
                          />
                        </div>
                      </div>
                    )}
                    <Icon
                      src={resetIcon}
                      className={reviewMasterOverviewStyle.resetIcon}
                      onClick={this.handleResetDatesTouched}
                      size={{ width: 16, height: 16 }}
                      title="Auto adjust dates after custom edit."
                    />
                  </div>
                </div>
              </WizardPage>
              <WizardPage showWhenPage={2} currentPage={wizardProps.page}>
                <div className={modalStyle.modalInner}>
                  <div className={modalStyle.modalFormRow}>
                    <label>Schema</label>
                    <div className={modalStyle.modalFormInputContainer}>
                      <Select
                        className={cx(
                          componentStyle.select,
                          modalStyle.modalFormInput
                        )}
                        classNamePrefix="pv"
                        options={schemas.map(schema => ({
                          value: schema.id,
                          label: schema.name,
                        }))}
                        placeholder={"Select."}
                        value={values.schema}
                        onBlur={() => this.props.setFieldTouched("schema")}
                        onChange={wrapper => this.onUpdateSchema(wrapper)}
                      />
                      <InfoIcon
                        src={helpIcon}
                        size={16}
                        tooltip="The next period start will be on this date and periodically afterwards."
                      />
                    </div>
                  </div>
                  {touched.schema && errors.schema && (
                    <Error>{errors.schema}</Error>
                  )}
                  <LoadButton
                    type="submit"
                    loading={loading}
                    disabled={isSubmitting}>
                    Submit
                  </LoadButton>
                </div>
              </WizardPage>
              <div className={modalStyle.modalInner}>
                {error && <Error>{error}</Error>}
                <WizardPageSelect
                  currentPage={wizardProps.page}
                  maxPage={wizardProps.maxPage}
                  switchPage={switchPage}
                />
              </div>
            </React.Fragment>
          )}
        />
      </form>
    )
  }
}

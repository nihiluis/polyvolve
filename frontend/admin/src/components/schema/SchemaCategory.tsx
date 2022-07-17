import * as React from "react"
import {
  SchemaActions,
  SchemaUpdateCategoryState,
  SchemaUpdateCriterionState,
} from "../../redux/schema"
import { schemaStyle, formStyle, style, cx } from "../../lib/reexports"
import { Line, Button } from "polyvolve-ui/lib"
import SchemaCriterion from "./SchemaCriterion"
import SchemaAddCriterion from "./SchemaAddCriterion"
import SubsectionEditButton from "../ui/section/SubsectionEditButton"
import Subsection from "../ui/section/Subsection"
import SubsectionContent from "../ui/section/SubsectionContent"
import SectionInformation from "../ui/section/SectionInformation"
import SubsectionTitle from "../ui/section/SubsectionTitle"
import Section from "../ui/section/Section"
import { Formik } from "formik"
import SchemaCategoryInformationEdit from "./SchemaCategoryInformationEdit"
import { UpIcon, DownIcon, RemoveIcon } from "polyvolve-ui/lib/icons"
import { ReviewCategory, ReviewSchema } from "polyvolve-ui/lib/@types"

interface Props {
  schema: ReviewSchema
  data: ReviewCategory
  addCriterion: any
  schemaActions: typeof SchemaActions
  updateCategory: SchemaUpdateCategoryState
  updateCriterion: SchemaUpdateCriterionState
}

interface State {
  addingCriterion: boolean
  edittingBasic: boolean
}

export interface FormDataBasic {
  name: string
  description: string
}

interface FormErrorsBasic {
  name?: string
  description?: string
}

class SchemaCategory extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      addingCriterion: false,
      edittingBasic: false,
    }
  }

  componentDidUpdate(oldProps: Props) {
    const newProps = this.props

    if (newProps.updateCategory.id === oldProps.data.id) {
      if (
        !oldProps.updateCategory.initialized &&
        newProps.updateCategory.initialized
      ) {
        this.toggleEdittingBasic()
      }
    }
  }

  openAddCriterion = () => this.setState({ addingCriterion: true })
  closeAddCriterion = () => this.setState({ addingCriterion: false })

  toggleEdittingBasic = () =>
    this.setState({ edittingBasic: !this.state.edittingBasic })

  validateBasic = (values: FormDataBasic) => {
    const errors: FormErrorsBasic = {}

    return errors
  }

  onSubmitBasic = (values: FormDataBasic) => {
    const { data, schemaActions } = this.props

    schemaActions.updateCategoryRequest({
      category: data,
      name: values.name,
      description: values.description,
    })
  }

  onClickToRemove = () => {
    const { data, schemaActions } = this.props

    schemaActions.removeCategoryRequest({ category: data })
  }

  onUp = () => {
    const { schema, data, schemaActions } = this.props
    const newOrder = data.order - 1

    schemaActions.setOrderCategoryRequest({
      schema,
      category: data,
      order: newOrder,
    })
  }

  onDown = () => {
    const { schema, data, schemaActions } = this.props
    const newOrder = data.order + 1

    schemaActions.setOrderCategoryRequest({
      schema,
      category: data,
      order: newOrder,
    })
  }

  render(): JSX.Element {
    const {
      schema,
      schemaActions,
      addCriterion,
      data,
      updateCriterion,
    } = this.props
    const { criteria, name, description } = this.props.data
    const { addingCriterion, edittingBasic } = this.state

    return (
      <div className={schemaStyle.category} key={`category-div-${data.id}`}>
        <div
          key={`category-title-bar-${data.id}`}
          className={cx(schemaStyle.categoryTitleBar, "mb06")}>
          <h1 key={`category-title-name-${data.id}`}>{name}</h1>
          <div key={`category-title-iconBar-${data.id}`}>
            {data.order > 0 && (
              <UpIcon size={{ width: 16, height: 16 }} onClick={this.onUp} />
            )}
            {data.order < schema.categories.length - 1 && (
              <DownIcon
                size={{ width: 16, height: 16 }}
                onClick={this.onDown}
              />
            )}
            <RemoveIcon size={16} onClick={this.onClickToRemove} />
          </div>
        </div>
        <Line
          key={`category-separator-${data.id}`}
          className={"mb06"}
        />
        <Section size="full" key={`category-section-${data.id}`}>
          <Subsection
            size="full"
            key={`category-subsection-basic-${data.id}`}
            className={cx({ [style.isEditting]: edittingBasic })}>
            <SubsectionTitle
              key={`category-subsection-title-basic-${data.id}`}
              title="Basic"
            />
            <SubsectionContent
              key={`category-subsection-content-basic-${data.id}`}
              size="full">
              {!edittingBasic && (
                <SectionInformation
                  key={`category-section-information-basic-${data.id}`}
                  items={[
                    { name: "Name:", value: data.name },
                    { name: "Description:", value: data.description },
                  ]}
                />
              )}
              {edittingBasic && (
                <Formik<FormDataBasic>
                  initialValues={{
                    name: data.name || "",
                    description: data.description || "",
                  }}
                  validate={this.validateBasic}
                  onSubmit={this.onSubmitBasic}
                  key={`category-form-basic-${data.id}`}
                  render={formikProps => (
                    <SchemaCategoryInformationEdit
                      {...formikProps}
                      key={`category-information-edit-basic-${data.id}`}
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
              key={`category-subsection-edit-button-basic-${data.id}`}
            />
          </Subsection>
          <Subsection
            size="full"
            twoRow={true}
            key={`category-subsection-criteria-${data.id}`}
            className={cx(
              { [style.isEditting]: edittingBasic },
              schemaStyle.criteriaSubsection
            )}>
            <SubsectionTitle
              title="Criteria"
              key={`category-subsection-criteria-title-${data.id}`}
            />
            <SubsectionContent
              size="full"
              key={`category-subsection-criteria-content-${data.id}`}>
              {criteria.length === 0 && (
                <p
                  key={`category-subsection-criteria-p-${data.id}`}
                  className={cx(style.alignCenter, style.mb1)}>
                  No schema criteria found! Click the + to add a new one.
                </p>
              )}
              {criteria.map((criterion, idx) => (
                <SchemaCriterion
                  schema={schema}
                  data={criterion}
                  index={idx}
                  category={data}
                  schemaActions={schemaActions}
                  updateCriterion={updateCriterion}
                  key={`category-subsection-criteria-criterion-outer-${data.id}-${criterion.id}`}
                />
              ))}
            </SubsectionContent>
          </Subsection>
        </Section>
        <Button
          type="button"
          name="add-category"
          className={cx(
            formStyle.plusButton,
            schemaStyle.addCriterionButton,
            style.btnAlternative
          )}
          onClick={this.openAddCriterion}
          key={`category-button-add-category-${data.id}`}>
          +
        </Button>
        <SchemaAddCriterion
          category={this.props.data}
          show={addingCriterion}
          schemaActions={schemaActions}
          onSubmit={() => {}}
          onClose={this.closeAddCriterion}
          key={`category-add-criterion-${data.id}`}
          {...addCriterion}
        />
      </div>
    )
  }
}

export default SchemaCategory

import * as React from "react"
import { SchemaActions, SchemaUpdateCriterionState } from "../../redux/schema"
import {
  schemaStyle,
  style,
  cx,
  formStyle,
  singleStyle,
  Select,
  componentStyle,
} from "../../lib/reexports"
import { RemoveIcon, UpIcon, DownIcon } from "polyvolve-ui/lib/icons"
import { FormikProps, Formik } from "formik"
import SubsectionEditButton from "../ui/section/SubsectionEditButton"
import { Error, Button } from "polyvolve-ui/lib"
import SectionButtonBar from "../ui/section/SectionButtonBar"
import { getReviewCriterionTypeDisplayName } from "../../lib/format"
import {
  ReviewSchema,
  ReviewCriterion,
  ReviewCategory,
} from "polyvolve-ui/lib/@types"
import PInput from "../ui/PInput"

interface Props {
  index: number
  data: ReviewCriterion
  schema: ReviewSchema
  schemaActions: typeof SchemaActions
  category: ReviewCategory
  updateCriterion: SchemaUpdateCriterionState
}

interface InnerProps extends Props {
  editting: boolean
  toggleEditting: () => void
}

interface State {
  editting: boolean
}

interface CriterionFormData {
  name: string
  description: string
  type: string
}

interface CriterionFormErrors {
  name?: string
  description?: string
  type?: string
}

interface FormProps extends FormikProps<CriterionFormData>, InnerProps {}

const SchemaCriterionNoEdit: React.FC<InnerProps> = props => {
  function onClick() {
    props.schemaActions.removeCriterionRequest({
      category: props.category,
      id: props.data.id,
    })
  }

  function onUp() {
    const newOrder = props.data.order - 1
    props.schemaActions.setOrderCriterionRequest({
      category: props.category,
      criterion: props.data,
      order: newOrder,
    })
  }

  function onDown() {
    const newOrder = props.data.order + 1
    props.schemaActions.setOrderCriterionRequest({
      category: props.category,
      criterion: props.data,
      order: newOrder,
    })
  }

  return (
    <div className={schemaStyle.criterion}>
      <div className={style.mb06}>
        <h4>{props.data.name}</h4>
        <p>{props.data.description}</p>
        <p>
          <strong>Type:</strong>{" "}
          {getReviewCriterionTypeDisplayName(props.data.type)}
        </p>
      </div>
      <div className={schemaStyle.criterionIconBar}>
        {props.data.order > 0 && (
          <UpIcon size={{ width: 16, height: 16 }} onClick={onUp} />
        )}
        {props.data.order < props.category.criteria.length - 1 && (
          <DownIcon size={{ width: 16, height: 16 }} onClick={onDown} />
        )}
        <RemoveIcon size={16} onClick={onClick} />
      </div>
      <SubsectionEditButton
        name={`criterion-edit-${props.data.id}`}
        toggleEditting={props.toggleEditting}
        editting={props.editting}
      />
    </div>
  )
}

const labelForValue = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1)

const SchemaCriterionEdit: React.FC<FormProps> = props => (
  <form onSubmit={props.handleSubmit}>
    <div className={formStyle.formRow}>
      <div className={singleStyle.informationFormItem}>
        <label>Name</label>
        <PInput
          name="name"
          type="text"
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          value={props.values.name}
        />
      </div>
      {props.touched.name && props.errors.name && (
        <Error>{props.errors.name}</Error>
      )}
    </div>
    <div className={formStyle.formRow}>
      <div className={singleStyle.informationFormItem}>
        <label>Description</label>
        <textarea
          name="description"
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          value={props.values.description}
        />
      </div>
      {props.touched.description && props.errors.description && (
        <Error>{props.errors.description}</Error>
      )}
    </div>
    <div className={formStyle.formRow}>
      <div className={singleStyle.informationFormItem}>
        <label>Type</label>
        <Select
          className={cx(singleStyle.selectMenu, componentStyle.select)}
          classNamePrefix="pv"
          placeholder={{
            value: props.values.type,
            label: labelForValue(props.values.type),
          }}
          value={{
            value: props.values.type,
            label: labelForValue(props.values.type),
          }}
          onBlur={() => props.setFieldTouched("type", true)}
          onChange={value => props.setFieldValue("type", value.value)}
          options={[
            { value: "scale", label: "Scale" },
            { value: "text", label: "Text" },
          ]}
        />
      </div>
      {props.touched.description && props.errors.description && (
        <Error>{props.errors.description}</Error>
      )}
    </div>
    {(props.touched.name || props.touched.description) &&
      props.updateCriterion.error && (
        <Error>{props.updateCriterion.error}</Error>
      )}
    <SectionButtonBar>
      <Button type="button" name="info-cancel" onClick={props.toggleEditting}>
        Cancel
      </Button>
      <Button type="submit" name="info-save" disabled={props.isSubmitting}>
        Save
      </Button>
    </SectionButtonBar>
  </form>
)

class SchemaCriterion extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      editting: false,
    }
  }

  componentDidUpdate(oldProps: Props) {
    const newProps = this.props

    if (
      !oldProps.updateCriterion.initialized &&
      newProps.updateCriterion.initialized &&
      !newProps.updateCriterion.error
    ) {
      this.setState({ editting: false })

      this.props.schemaActions.getCategoriesRequest({ schema: newProps.schema })
    }
  }

  validate(values: CriterionFormData): CriterionFormErrors {
    const errors: CriterionFormErrors = {}

    return errors
  }

  onSubmit = (values: CriterionFormData) => {
    const { schemaActions, data } = this.props

    schemaActions.updateCriterionRequest({
      criterion: data,
      name: values.name,
      description: values.description,
      type: values.type,
    })
  }

  toggleEditting = () => this.setState({ editting: !this.state.editting })

  render(): JSX.Element {
    const { data } = this.props
    const { editting } = this.state

    return editting ? (
      <Formik<CriterionFormData>
        initialValues={{
          name: data.name || "",
          description: data.description || "",
          type: data.type || "",
        }}
        validate={this.validate}
        onSubmit={this.onSubmit}
        render={formikProps => (
          <SchemaCriterionEdit
            editting={editting}
            toggleEditting={this.toggleEditting}
            {...this.props}
            {...formikProps}
          />
        )}
      />
    ) : (
      <SchemaCriterionNoEdit
        editting={editting}
        toggleEditting={this.toggleEditting}
        {...this.props}
      />
    )
  }
}

export default SchemaCriterion

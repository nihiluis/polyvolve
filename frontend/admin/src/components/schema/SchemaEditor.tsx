import * as React from "react"
import { bindActionCreators, Dispatch } from "redux"
import { connect } from "react-redux"

import { RootState } from "../../redux"

import {
  SchemaActions,
  SchemaAddCategoryState,
  SchemaAddCriterionState,
  SchemaUpdateCriterionState,
  SchemaUpdateCategoryState,
  SchemaAddState,
} from "../../redux/schema"
import { Button, Load, Error } from "polyvolve-ui/lib"
import SchemaAddCategory from "./SchemaAddCategory"
import SchemaCategory from "./SchemaCategory"
import {
  formStyle,
  style,
  cx,
  Select,
  componentStyle,
  schemaStyle,
} from "../../lib/reexports"
import SchemaAdd from "./SchemaAdd"
import { ReviewCategory, ReviewSchema } from "polyvolve-ui/lib/@types"

interface Props {
  loading: boolean
  categoriesInitialized: boolean
  schemasInitialized: boolean
  categories: ReviewCategory[]
  error?: string
  schemas?: ReviewSchema[]
  schemaActions?: typeof SchemaActions
  addSchema?: SchemaAddState
  addCategory?: SchemaAddCategoryState
  addCriterion?: SchemaAddCriterionState
  updateCategory?: SchemaUpdateCategoryState
  updateCriterion?: SchemaUpdateCriterionState
}

interface State {
  activeSchema?: ReviewSchema
  addingSchema: boolean
  addingCategory: boolean
}

class SchemaEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      addingSchema: false,
      addingCategory: false,
    }
  }

  componentDidMount() {
    this.props.schemaActions.getSchemasRequest()
  }

  componentDidUpdate(oldProps: Props) {
    const newProps = this.props
    if (oldProps.schemas.length === 0 && newProps.schemas.length > 0) {
      this.setState({ activeSchema: newProps.schemas[0] }, () =>
        this.props.schemaActions.getCategoriesRequest({
          schema: newProps.schemas[0],
        })
      )
    }

    if (!oldProps.schemasInitialized && newProps.schemasInitialized) {
      if (
        this.state.activeSchema &&
        newProps.schemas.findIndex(
          schema => schema.id === this.state.activeSchema.id
        ) !== -1
      ) {
        this.props.schemaActions.getCategoriesRequest({
          schema: this.state.activeSchema,
        })
      } else {
        if (newProps.schemas.length > 0) {
          this.setState({ activeSchema: newProps.schemas[0] }, () =>
            this.props.schemaActions.getCategoriesRequest({
              schema: newProps.schemas[0],
            })
          )
        }
      }
      // check on difference whether activeSchema from before is still available
      // retriev new schemas on adding shcema
    }

    if (!oldProps.addSchema.initialized && newProps.addSchema.initialized) {
      this.props.schemaActions.getSchemasRequest()
    }

    if (this.state.activeSchema) {
      if (
        (!oldProps.addCategory.initialized &&
          newProps.addCategory.initialized) ||
        (!oldProps.addCriterion.initialized &&
          newProps.addCriterion.initialized)
      ) {
        this.props.schemaActions.getCategoriesRequest({
          schema: this.state.activeSchema,
        })
      }
    }
  }

  openAddSchema = () => this.setState({ addingSchema: true })
  onAddSchema = () => this.setState({ addingSchema: false })

  openAddCategory = () => this.setState({ addingCategory: true })
  onAddCategory = () => this.setState({ addingCategory: false })

  setActiveSchema = (schemaWrapper: { value: ReviewSchema; label: string }) =>
    this.setState({ activeSchema: schemaWrapper.value }, () =>
      this.props.schemaActions.getCategoriesRequest({
        schema: schemaWrapper.value,
      })
    )

  render(): JSX.Element {
    const {
      categories,
      schemas,
      schemasInitialized,
      categoriesInitialized,
      loading,
      schemaActions,
      addCategory,
      addCriterion,
      updateCategory,
      updateCriterion,
      addSchema,
    } = this.props
    const { addingCategory, addingSchema, activeSchema } = this.state

    const currentSelectValue = activeSchema
      ? { value: activeSchema, label: activeSchema.name }
      : null

    return (
      <React.Fragment>
        <div className={cx("mb1", schemaStyle.schemaSelectBar)}>
          <Select
            className={cx(schemaStyle.selectSchema)}
            classNamePrefix="pv"
            options={schemas.map(schema => ({
              value: schema,
              label: schema.name,
            }))}
            value={currentSelectValue}
            onChange={this.setActiveSchema}
          />
          <Button
            type="button"
            name="add-schema"
            className={schemaStyle.plusButton}
            onClick={this.openAddSchema}>
            +
          </Button>
        </div>
        {!loading && addingSchema && (
          <SchemaAdd
            show={addingSchema}
            schemaActions={schemaActions}
            onSubmit={() => {}}
            onClose={this.onAddSchema}
            {...addSchema}
          />
        )}
        {!loading && schemas.length === 0 && (
          <Error className={style.alignCenter}>
            No schemas found. Perhaps create a new one?
          </Error>
        )}
        {!loading && !activeSchema && schemas.length > 0 && (
          <Error className={style.alignCenter}>No schema selected.</Error>
        )}
        {!loading && activeSchema && (
          <React.Fragment>
            {categoriesInitialized && (
              <div>
                <div>
                  {categories.length === 0 && (
                    <p className={cx(style.alignCenter, style.mb1)}>
                      No schema categories found! Click the + to add a new one.
                    </p>
                  )}
                  {categories.map(category => (
                    <SchemaCategory
                      schema={activeSchema}
                      data={category}
                      schemaActions={schemaActions}
                      addCriterion={addCriterion}
                      updateCategory={updateCategory}
                      updateCriterion={updateCriterion}
                      key={`category-outer-${category.id}`}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  name="add-category"
                  className={formStyle.plusButton}
                  onClick={this.openAddCategory}>
                  +
                </Button>
                <SchemaAddCategory
                  show={addingCategory}
                  schema={activeSchema}
                  schemaActions={schemaActions}
                  onSubmit={() => {}}
                  onClose={this.onAddCategory}
                  {...addCategory}
                />
              </div>
            )}
          </React.Fragment>
        )}
        {loading && (
          <div className={schemaStyle.loadContainer}>
            <Load />
          </div>
        )}
      </React.Fragment>
    )
  }
}

function mapStateToProps(state: RootState): Partial<Props> {
  return {
    categories: state.schema.editor.categories,
    error: state.schema.editor.error,
    schemas: state.schema.editor.schemas,
    categoriesInitialized: state.schema.editor.categoriesInitialized,
    schemasInitialized: state.schema.editor.schemasInitialized,
    loading: state.schema.editor.loading,
    addSchema: state.schema.add,
    addCategory: state.schema.addCategory,
    addCriterion: state.schema.addCriterion,
    updateCategory: state.schema.updateCategory,
    updateCriterion: state.schema.updateCriterion,
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<Props> {
  return {
    schemaActions: bindActionCreators(SchemaActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SchemaEditor)

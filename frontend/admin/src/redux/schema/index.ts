import { AxiosResponse, AxiosError } from "axios"
import { take, call, put } from "redux-saga/effects"
import { axios, getErrorMessage, authenticatedHeader, defaultHeaders } from "../../lib/axios"
import { lazyProtect } from "await-protect"
import { API_URL } from "../../constants/env";
import { createAction, handleActions } from "redux-actions"
import { NotificationMessageActions } from "../message";

import { ReviewSchema, ReviewCategory, ReviewCriterion } from "polyvolve-ui/lib/@types"
import { sortByOrder } from "polyvolve-ui/lib/utils/sort"

export interface SchemaEditorState {
  error: string
  loading: boolean
  schemasInitialized: boolean
  categoriesInitialized: boolean
  schemas: ReviewSchema[]
  categories: ReviewCategory[]
}

export interface SchemaAddState {
  error: string
  loading: boolean
  initialized: boolean
  newData?: ReviewSchema
}

export interface SchemaAddCategoryState {
  error: string
  loading: boolean
  initialized: boolean
  newData?: ReviewCategory
}

export interface SchemaAddCriterionState {
  error: string
  loading: boolean
  initialized: boolean
  newData?: ReviewCriterion
}

export interface SchemaUpdateCategoryState {
  error: string
  id: string
  loading: boolean
  initialized: boolean
  newData?: ReviewCategory
}

export interface SchemaUpdateCriterionState {
  error: string
  id: string
  loading: boolean
  initialized: boolean
  newData?: ReviewCriterion
}

const initialState: SchemaEditorState = {
  error: "",
  loading: false,
  schemasInitialized: false,
  categoriesInitialized: false,
  schemas: [],
  categories: [],
}

const initialAddState: SchemaAddState = {
  error: "",
  loading: false,
  initialized: false,
}

const initialAddCategoryState: SchemaAddCategoryState = {
  error: "",
  loading: false,
  initialized: false,
}

const initialAddCriterionState: SchemaAddCriterionState = {
  error: "",
  loading: false,
  initialized: false,
}

const initialUpdateCategoryState: SchemaUpdateCategoryState = {
  error: "",
  id: "",
  loading: false,
  initialized: false,
}

const initialUpdateCriterionState: SchemaUpdateCriterionState = {
  error: "",
  id: "",
  loading: false,
  initialized: false,
}

const actionNames = {
  GET_SCHEMAS_REQUEST: "GET_SCHEMAS_REQUEST",
  GET_SCHEMAS_RESPONSE: "GET_SCHEMAS_RESPONSE",
  CREATE_SCHEMA_REQUEST: "CREATE_SCHEMA_REQUEST",
  CREATE_SCHEMA_RESPONSE: "CREATE_SCHEMA_RESPONSE",
  UPDATE_SCHEMA_REQUEST: "UPDATE_SCHEMA_REQUEST",
  UPDATE_SCHEMA_RESPONSE: "UPDATE_SCHEMA_RESPONSE",
  REMOVE_SCHEMA_REQUEST: "REMOVE_SCHEMA_REQUEST",
  REMOVE_SCHEMA_RESPONSE: "REMOVE_SCHEMA_RESPONSE",
  GET_CATEGORIES_REQUEST: "GET_CATEGORIES_REQUEST",
  GET_CATEGORIES_RESPONSE: "GET_CATEGORIES_RESPONSE",
  CREATE_CATEGORY_REQUEST: "CREATE_CATEGORY_REQUEST",
  CREATE_CATEGORY_RESPONSE: "CREATE_CATEGORY_RESPONSE",
  UPDATE_CATEGORY_REQUEST: "UPDATE_CATEGORY_REQUEST",
  UPDATE_CATEGORY_RESPONSE: "UPDATE_CATEGORY_RESPONSE",
  REMOVE_CATEGORY_REQUEST: "REMOVE_CATEGORY_REQUEST",
  REMOVE_CATEGORY_RESPONSE: "REMOVE_CATEGORY_RESPONSE",
  CREATE_CRITERION_REQUEST: "CREATE_CRITERION_REQUEST",
  CREATE_CRITERION_RESPONSE: "CREATE_CRITERION_RESPONSE",
  UPDATE_CRITERION_REQUEST: "UPDATE_CRITERION_REQUEST",
  UPDATE_CRITERION_RESPONSE: "UPDATE_CRITERION_RESPONSE",
  REMOVE_CRITERION_REQUEST: "REMOVE_CRITERION_REQUEST",
  REMOVE_CRITERION_RESPONSE: "REMOVE_CRITERION_RESPONSE",
  SET_ORDER_CRITERION_REQUEST: "SET_ORDER_CRITERION_REQUEST",
  SET_ORDER_CRITERION_RESPONSE: "SET_ORDER_CRITERION_RESPONSE",
  SET_ORDER_CATEGORY_REQUEST: "SET_ORDER_CATEGORY_REQUEST",
  SET_ORDER_CATEGORY_RESPONSE: "SET_ORDER_CATEGORY_RESPONSE",
}

const actions = {
  getSchemasRequest: createAction<{}>(actionNames.GET_SCHEMAS_REQUEST),
  getSchemasResponse: createAction<ReviewCategory[]>(actionNames.GET_SCHEMAS_RESPONSE),
  createSchemaRequest: createAction<{ name: string, description: string }>(actionNames.CREATE_SCHEMA_REQUEST),
  createSchemaResponse: createAction<ReviewSchema>(actionNames.CREATE_SCHEMA_RESPONSE),
  updateSchemaRequest: createAction<{ id: string } & Partial<ReviewSchema>>(actionNames.UPDATE_SCHEMA_REQUEST),
  updateSchemaResponse: createAction<ReviewSchema>(actionNames.UPDATE_SCHEMA_RESPONSE),
  removeSchemaRequest: createAction<{ id: string }>(actionNames.REMOVE_SCHEMA_REQUEST),
  removeSchemaResponse: createAction<{}>(actionNames.REMOVE_SCHEMA_RESPONSE),
  getCategoriesRequest: createAction<{ schemaId: string }>(actionNames.GET_CATEGORIES_REQUEST),
  getCategoriesResponse: createAction<ReviewCategory[]>(actionNames.GET_CATEGORIES_RESPONSE),
  createCategoryRequest: createAction<{ name: string, description: string }>(actionNames.CREATE_CATEGORY_REQUEST),
  createCategoryResponse: createAction<ReviewCategory>(actionNames.CREATE_CATEGORY_RESPONSE),
  updateCategoryRequest: createAction<{ id: string } & Partial<ReviewCategory>>(actionNames.UPDATE_CATEGORY_REQUEST),
  updateCategoryResponse: createAction<ReviewCategory>(actionNames.UPDATE_CATEGORY_RESPONSE),
  removeCategoryRequest: createAction<{ id: string }>(actionNames.REMOVE_CATEGORY_REQUEST),
  removeCategoryResponse: createAction<{}>(actionNames.REMOVE_CATEGORY_RESPONSE),
  createCriterionRequest: createAction<{ name: string, description: string }>(actionNames.CREATE_CRITERION_REQUEST),
  createCriterionResponse: createAction<ReviewCriterion>(actionNames.CREATE_CRITERION_RESPONSE),
  updateCriterionRequest: createAction<{ id: string } & Partial<ReviewCriterion>>(actionNames.UPDATE_CRITERION_REQUEST),
  updateCriterionResponse: createAction<ReviewCriterion>(actionNames.UPDATE_CRITERION_RESPONSE),
  removeCriterionRequest: createAction<{ id: string }>(actionNames.REMOVE_CRITERION_REQUEST),
  removeCriterionResponse: createAction<{}>(actionNames.REMOVE_CRITERION_RESPONSE),
  setOrderCriterionRequest: createAction<any>(actionNames.SET_ORDER_CRITERION_REQUEST),
  setOrderCriterionResponse: createAction<any>(actionNames.SET_ORDER_CRITERION_RESPONSE),
  setOrderCategoryRequest: createAction<any>(actionNames.SET_ORDER_CATEGORY_REQUEST),
  setOrderCategoryResponse: createAction<any>(actionNames.SET_ORDER_CATEGORY_RESPONSE)
}

export const SchemaActions = actions

export const schemaAddReducer = handleActions<SchemaAddState, any>({
  [actionNames.CREATE_SCHEMA_REQUEST]: (state, action) => {
    return {
      ...action.payload,
      error: "",
      loading: true,
      initialized: false,
    }
  },
  [actionNames.CREATE_SCHEMA_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: false,
      initialized: true,
    }
  },
}, initialAddState)

export const schemaAddCategoryReducer = handleActions<SchemaAddCategoryState, any>({
  [actionNames.CREATE_CATEGORY_REQUEST]: (state, action) => {
    return {
      error: "",
      loading: true,
      initialized: false,
    }
  },
  [actionNames.CREATE_CATEGORY_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: false,
      initialized: true,
    }
  },
}, initialAddCategoryState)

export const schemaAddCriterionReducer = handleActions<SchemaAddCriterionState, any>({
  [actionNames.CREATE_CRITERION_REQUEST]: (state, action) => {
    return {
      error: "",
      loading: true,
      initialized: false,
    }
  },
  [actionNames.CREATE_CRITERION_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: false,
      initialized: true,
    }
  },
}, initialAddCriterionState)

export const schemaUpdateCategoryReducer = handleActions<SchemaUpdateCategoryState, any>({
  [actionNames.UPDATE_CATEGORY_REQUEST]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      id: action.payload.category.id,
      initialized: false,
      loading: true,
    }
  },
  [actionNames.UPDATE_CATEGORY_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      initialized: true,
      loading: false,
    }
  },
}, initialUpdateCategoryState)

export const schemaUpdateCriterionReducer = handleActions<SchemaUpdateCriterionState, any>({
  [actionNames.UPDATE_CRITERION_REQUEST]: (state, action) => {
    return {
      ...state,
      id: action.payload.criterion.id,
      initialized: false,
      loading: true,
    }
  },
  [actionNames.UPDATE_CRITERION_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      initialized: true,
      loading: false,
    }
  },
}, initialUpdateCriterionState)

export const schemaEditorReducer = handleActions<SchemaEditorState, Partial<SchemaEditorState>>({
  [actionNames.GET_SCHEMAS_REQUEST]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: true,
      schemasInitialized: false,
    }
  },
  [actionNames.GET_SCHEMAS_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: false,
      schemasInitialized: true,
    }
  },
  [actionNames.REMOVE_CATEGORY_REQUEST]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: true,
    }
  },
  [actionNames.REMOVE_CATEGORY_RESPONSE]: (state: SchemaEditorState, action) => {
    const newState = { ...state }
    const { category } = action.payload

    newState.categories = newState.categories.filter(category => category.id !== category.id)

    return {
      ...newState,
      ...action.payload,
      loading: false,
    }
  },
  [actionNames.GET_CATEGORIES_REQUEST]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: true,
      categoriesInitialized: false,
    }
  },
  [actionNames.GET_CATEGORIES_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: false,
      categoriesInitialized: true,
    }
  },
  [actionNames.REMOVE_SCHEMA_REQUEST]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: true,
    }
  },
  [actionNames.REMOVE_SCHEMA_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: false,
    }
  },
  [actionNames.REMOVE_CRITERION_REQUEST]: (state: SchemaEditorState, action) => {
    const { error, category, id } = action.payload

    const categoryIndex = state.categories.indexOf(category)
    state.categories[categoryIndex].criteria = category.criteria.filter(criterion => criterion.id !== id)

    return {
      ...state,
      error,
      loading: true,
    }
  },
  [actionNames.REMOVE_CRITERION_RESPONSE]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      loading: false,
    }
  },
  [actionNames.UPDATE_CATEGORY_RESPONSE]: (state, action) => {
    const body = {
      ...state,
    }

    const updatedCategory: ReviewCategory = action.payload.newData

    if (updatedCategory) {
      const categories: ReviewCategory[] = [...state.categories]
      const idx = categories.findIndex(category => category.id === updatedCategory.id)

      if (idx !== -1) {
        categories[idx] = updatedCategory
      }

      body.categories = categories
    }

    return body
  },
  [actionNames.SET_ORDER_CRITERION_RESPONSE]: (state: SchemaEditorState, action) => {
    const category: ReviewCategory = action.payload.category
    const criterion: ReviewCriterion = action.payload.criterion
    const order: number = action.payload.order

    const currentIndex = category.criteria.indexOf(criterion)
    const newCriteria = [...category.criteria]
    newCriteria.splice(currentIndex, 1)
    newCriteria.splice(order, 0, criterion)
    newCriteria.forEach((criterion, idx) => criterion.order = idx)

    category.criteria = newCriteria

    return {
      ...state,
      categories: [...state.categories]
    }
  },
  [actionNames.SET_ORDER_CATEGORY_RESPONSE]: (state: SchemaEditorState, action) => {
    const category: ReviewCategory = action.payload.category
    const schema: ReviewSchema = action.payload.schema
    const order: number = action.payload.order

    const currentIndex = state.categories.indexOf(category)
    const newCategories = [...state.categories]
    newCategories.splice(currentIndex, 1)
    newCategories.splice(order, 0, category)
    newCategories.forEach((category, idx) => category.order = idx)

    return {
      ...state,
      categories: newCategories
    }
  },
}, initialState)

export function* handleGetSchemas() {
  while (true) {
    yield take(actions.getSchemasRequest)

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.get(`${API_URL}/review/schema/all`,
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.getSchemasResponse({ error: getErrorMessage(err) }))
      continue
    }

    const reviewSchemas = ok.data.data

    yield put(actions.getSchemasResponse({ error: "", schemas: reviewSchemas }))
  }
}

export function* handleCreateSchema() {
  while (true) {
    const action = yield take(actions.createSchemaRequest)
    const { name, description } = action.payload

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.post(`${API_URL}/review/schema/create`, { name, description },
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.createSchemaResponse({ error: getErrorMessage(err) }))

      continue
    }

    if (ok.status != 200) {
      yield put(actions.createSchemaResponse({ error: getErrorMessage(err) }))

      continue
    }

    yield put(actions.createSchemaResponse({ error: "" }))
  }
}

export function* handleUpdateSchema() {
  while (true) {
    const action = yield take(actions.updateSchemaRequest)
    const { schema, name, description } = action.payload

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.post(`${API_URL}/review/schema/update`, { id: schema.id, name, description },
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.updateSchemaResponse({ error: getErrorMessage(err) }))

      continue
    }

    if (ok.status != 200) {
      yield put(actions.updateSchemaResponse({ error: getErrorMessage(err) }))

      continue
    }

    yield put(actions.updateSchemaResponse({ error: "" }))
  }
}

export function* handleRemoveSchema() {
  while (true) {
    const action = yield take(actions.removeSchemaRequest)
    const { id } = action.payload

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.get(`${API_URL}/review/schema/delete/${id}`,
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    yield put(NotificationMessageActions.info(`Trying to remove schema...`))

    if (err) {
      yield put(actions.removeSchemaResponse({ error: getErrorMessage(err) }))
      yield put(NotificationMessageActions.error(`Unable to remove schema.`))
      continue
    }

    if (ok.status != 200) {
      yield put(actions.removeSchemaResponse({ error: getErrorMessage(err) }))
      yield put(NotificationMessageActions.error("Unable to remove schema."))
      continue
    }

    yield put(actions.removeSchemaResponse({ error: "" }))
    yield put(NotificationMessageActions.error("Successfully removed schema. Retrieving new schemas..."))
    yield put(actions.getSchemasRequest())
  }
}

export function* handleGetCategories() {
  while (true) {
    const action = yield take(actions.getCategoriesRequest)
    const { schema } = action.payload

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.get(`${API_URL}/review/schema/category/all/${schema.id}`,
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.getCategoriesResponse({ error: getErrorMessage(err) }))
      continue
    }

    if (ok.status != 200) {
      yield put(actions.getCategoriesResponse({ error: getErrorMessage(err) }))
      continue
    }


    const reviewCategories = ok.data.data

    reviewCategories.sort(sortByOrder)
    reviewCategories.forEach(category => {
      category.criteria.sort(sortByOrder)
    })

    yield put(actions.getCategoriesResponse({ error: "", categories: reviewCategories }))
  }
}

export function* handleCreateCategory() {
  while (true) {
    const action = yield take(actions.createCategoryRequest)
    const { name, description, schema } = action.payload

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.post(`${API_URL}/review/schema/category/create`, { name, description, schemaId: schema.id },
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.createCategoryResponse({ error: getErrorMessage(err) }))

      continue
    }

    if (ok.status != 200) {
      yield put(actions.createCategoryResponse({ error: getErrorMessage(err) }))

      continue
    }

    yield put(actions.createCategoryResponse({ error: "" }))
  }
}

export function* handleUpdateCategory() {
  while (true) {
    const action = yield take(actions.updateCategoryRequest)
    const { category, name, description } = action.payload

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.post(`${API_URL}/review/schema/category/update`, { id: category.id, name, description },
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.updateCategoryResponse({ error: getErrorMessage(err) }))

      continue
    }

    if (ok.status != 200) {
      yield put(actions.updateCategoryResponse({ error: getErrorMessage(err) }))

      continue
    }

    const newData: ReviewCategory = ok.data.data

    yield put(actions.updateCategoryResponse({ error: "", newData }))
  }
}

export function* handleRemoveCategory() {
  while (true) {
    const action = yield take(actions.removeCategoryRequest)
    const { category } = action.payload

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.get(`${API_URL}/review/schema/category/delete/${category.id}`,
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    yield put(NotificationMessageActions.info(`Trying to remove category...`))

    if (err) {
      yield put(actions.removeCategoryResponse({ error: getErrorMessage(err) }))
      yield put(NotificationMessageActions.error(`Unable to remove category.`))
      continue
    }

    if (ok.status != 200) {
      yield put(actions.removeCategoryResponse({ error: getErrorMessage(err) }))
      yield put(NotificationMessageActions.error("Unable to remove category."))
      continue
    }

    yield put(actions.removeCategoryResponse({ error: "", category }))
    yield put(NotificationMessageActions.error("Successfully removed category."))
  }
}

export function* handleCreateCriterion() {
  while (true) {
    const action = yield take(actions.createCriterionRequest)
    const { name, description, type } = action.payload
    const category: ReviewCategory = action.payload.category

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.post(`${API_URL}/review/schema/criterion/create`,
        { categoryId: category.id, name, description, type },
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.createCriterionResponse({ error: getErrorMessage(err) }))

      continue
    }

    if (ok.status != 200) {
      yield put(actions.createCriterionResponse({ error: getErrorMessage(err) }))

      continue
    }

    yield put(actions.createCriterionResponse({ error: "" }))
  }
}

export function* handleUpdateCriterion() {
  while (true) {
    const action = yield take(actions.updateCriterionRequest)
    const { criterion, name, description, type } = action.payload

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.post(`${API_URL}/review/schema/criterion/update`, { id: criterion.id, name, description, type },
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.updateCriterionResponse({ error: getErrorMessage(err) }))

      continue
    }

    if (ok.status != 200) {
      yield put(actions.updateCriterionResponse({ error: getErrorMessage(err) }))

      continue
    }

    const newData: ReviewCriterion = ok.data.data

    yield put(actions.updateCriterionResponse({ error: "", newData }))
  }
}

export function* handleRemoveCriterion() {
  while (true) {
    const action = yield take(actions.removeCriterionRequest)
    const { category, id } = action.payload

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.get(`${API_URL}/review/schema/criterion/delete/${id}`,
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.removeCriterionResponse({ error: getErrorMessage(err) }))

      continue
    }

    if (ok.status != 200) {
      yield put(actions.removeCriterionResponse({ error: getErrorMessage(err) }))

      continue
    }

    yield put(actions.removeCriterionResponse({ error: "", category, id }))
  }
}

export function* handleSetOrderCriterion() {
  while (true) {
    const action = yield take(actions.setOrderCriterionRequest)
    const { category, criterion, order } = action.payload

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.post(`${API_URL}/review/schema/criterion/order/set`, { categoryId: category.id, criterionId: criterion.id, order },
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.setOrderCriterionResponse({ error: getErrorMessage(err) }))

      continue
    }

    if (ok.status != 200) {
      yield put(actions.setOrderCriterionResponse({ error: getErrorMessage(err) }))

      continue
    }

    yield put(actions.setOrderCriterionResponse({ error: "", category, criterion, order }))
  }
}

export function* handleSetOrderCategory() {
  while (true) {
    const action = yield take(actions.setOrderCategoryRequest)
    const { category, schema, order } = action.payload

    const { ok, err } = yield call(lazyProtect<AxiosResponse, AxiosError>(
      axios.post(`${API_URL}/review/schema/category/order/set`, { categoryId: category.id, schemaId: schema.id, order },
        { withCredentials: true, headers: { ...authenticatedHeader(), ...defaultHeaders } })))

    if (err) {
      yield put(actions.setOrderCategoryResponse({ error: getErrorMessage(err) }))

      continue
    }

    if (ok.status != 200) {
      yield put(actions.setOrderCategoryResponse({ error: getErrorMessage(err) }))

      continue
    }

    yield put(actions.setOrderCategoryResponse({ error: "", category, schema, order }))
  }
}

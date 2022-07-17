import * as React from "react"
import { User } from "polyvolve-ui/lib/@types"
import { Button, Error } from "polyvolve-ui/lib"
import { Formik } from "formik"

import SectionTitle from "../../ui/section/SectionTitle"
import Section from "../../ui/section/Section"
import SectionInformation from "../../ui/section/SectionInformation"
import SectionHeader from "../../ui/section/SectionHeader"
import Subsection from "../../ui/section/Subsection"
import SubsectionTitle from "../../ui/section/SubsectionTitle"
import SectionButtonBar from "../../ui/section/SectionButtonBar"
import SubsectionEditButton from "../../ui/section/SubsectionEditButton"
import SectionContent from "../../ui/section/SectionContent"
import SubsectionContent from "../../ui/section/SubsectionContent"
import { singleStyle } from "../../../lib/reexports"
import { formatSex } from "../../../lib/format"
import PInput from "../../ui/PInput"

interface UpdateUserParams {
  id: string
  name: string
  surname: string
  mail: string
  description: string
  position: string
}

interface Props {
  user: User
  loading: boolean
  updateUser: (params: UpdateUserParams) => void
}

interface State {
  editting: boolean
  submitted: boolean
}

interface FormData {
  name: string
  surname: string
  mail: string
  description: string
  position: string
}

interface FormErrors {
  name?: string
  surname?: string
  mail?: string
  description?: string
  position?: string
}

class UserInformationSection extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      editting: false,
      submitted: false,
    }
  }

  toggleEditting = () => {
    const newEdittingState = !this.state.editting

    this.setState({ editting: newEdittingState })
  }

  validate = (values: FormData): FormErrors => {
    const errors: FormErrors = {}

    if (!values.name) {
      errors.name = "Missing name."
    }

    if (!values.mail) {
      errors.mail = "Missing mail."
    }

    if (!values.description) {
      errors.description = "Missing description."
    }

    return errors
  }

  onSubmit = (
    values: FormData,
    { setSubmitting }: { setSubmitting: (value: boolean) => void }
  ) => {
    const { user, updateUser } = this.props
    this.setState({ submitted: true, editting: false })

    updateUser({ id: user.id, ...values })

    setSubmitting(false)
  }

  render(): JSX.Element {
    const { user } = this.props
    const { editting } = this.state

    return (
      <React.Fragment>
        <Section size="full">
          <SectionHeader>
            <SectionTitle title="Information" size="full" />
          </SectionHeader>
          <SectionContent>
            <Subsection size="full">
              <SubsectionTitle title="Basic" />
              <SubsectionContent>
                {!editting && (
                  <SectionInformation
                    items={[
                      { name: "Name:", value: user.name },
                      { name: "Surname:", value: user.surname },
                      { name: "Mail: ", value: user.mail },
                      { name: "Description:", value: user.description },
                      { name: "Position:", value: user.position },
                      { name: "Sex:", value: formatSex(user.sex) },
                    ]}
                  />
                )}
                {editting && (
                  <Formik<FormData>
                    initialValues={{
                      name: user.name || "",
                      surname: user.surname || "",
                      mail: user.mail || "",
                      description: user.description || "",
                      position: user.position || "",
                    }}
                    validate={this.validate}
                    onSubmit={this.onSubmit}
                    render={({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                    }) => (
                      <form onSubmit={handleSubmit}>
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
                        {touched.name && errors.name && (
                          <Error>{errors.name}</Error>
                        )}
                        <div className={singleStyle.informationFormItem}>
                          <label>Name</label>
                          <PInput
                            name="surname"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.surname}
                          />
                        </div>
                        {touched.surname && errors.surname && (
                          <Error>{errors.surname}</Error>
                        )}
                        <div className={singleStyle.informationFormItem}>
                          <label>Mail</label>
                          <PInput
                            name="mail"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.mail}
                          />
                        </div>
                        {touched.surname && errors.surname && (
                          <Error>{errors.surname}</Error>
                        )}
                        <div className={singleStyle.informationFormItem}>
                          <label>Position</label>
                          <PInput
                            name="position"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.position}
                          />
                        </div>
                        {touched.position && errors.position && (
                          <Error>{errors.position}</Error>
                        )}
                        <div className={singleStyle.informationFormItem}>
                          <label>Description</label>
                          <textarea
                            name="description"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.description}
                          />
                        </div>
                        {touched.description && errors.description && (
                          <Error>{errors.description}</Error>
                        )}
                        {editting && (
                          <SectionButtonBar>
                            <Button
                              type="button"
                              name="teams-cancel"
                              onClick={this.toggleEditting}>
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              name="teams-save"
                              disabled={isSubmitting}>
                              Save
                            </Button>
                          </SectionButtonBar>
                        )}
                      </form>
                    )}
                  />
                )}
              </SubsectionContent>
              <SubsectionEditButton
                name="information-edit"
                toggleEditting={this.toggleEditting}
                editting={editting}
              />
            </Subsection>
          </SectionContent>
        </Section>
      </React.Fragment>
    )
  }
}

export default UserInformationSection

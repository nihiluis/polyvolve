import * as React from "react"
import SectionTitle from "../../ui/section/SectionTitle"
import Section from "../../ui/section/Section"
import SectionInformation from "../../ui/section/SectionInformation"
import SectionHeader from "../../ui/section/SectionHeader"
import Subsection from "../../ui/section/Subsection"
import SubsectionTitle from "../../ui/section/SubsectionTitle"
import { Formik } from "formik"
import SectionButtonBar from "../../ui/section/SectionButtonBar"
import { Button, Error } from "polyvolve-ui/lib"
import SubsectionEditButton from "../../ui/section/SubsectionEditButton"
import SubsectionContent from "../../ui/section/SubsectionContent"
import { Team } from "polyvolve-ui/lib/@types"
import { singleStyle } from "../../../lib/reexports"
import PInput from "../../ui/PInput"

interface UpdateTeamParams {
  id: string
  name: string
  description: string
}

interface Props {
  team?: Team
  loading: boolean
  updateTeam: (params: UpdateTeamParams) => void
}

interface State {
  editting: boolean
  submitted: boolean
}

interface FormData {
  name: string
  description: string
}

interface FormErrors {
  name?: string
  description?: string
}

class TeamInformationSection extends React.Component<Props, State> {
  state = {
    editting: false,
    submitted: false,
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

    if (!values.description) {
      errors.description = "Missing description."
    }

    return errors
  }

  onSubmit = (
    values: FormData,
    { setSubmitting }: { setSubmitting: (value: boolean) => void }
  ) => {
    const { team, updateTeam } = this.props
    this.setState({ submitted: true, editting: false })

    updateTeam({ ...team, ...values })

    setSubmitting(false)
  }

  render(): JSX.Element {
    const { team } = this.props
    const { editting } = this.state

    return (
      <React.Fragment>
        <Section size="full">
          <SectionHeader>
            <SectionTitle title="Information" size="full" />
          </SectionHeader>
          <Subsection size="full">
            <SubsectionTitle title="Basic" />
            <SubsectionContent>
              {!editting && (
                <SectionInformation
                  items={[
                    { name: "Name:", value: team.name },
                    { name: "Description:", value: team.description },
                  ]}
                />
              )}
              {editting && (
                <Formik<FormData>
                  initialValues={{
                    name: team.name || "",
                    description: team.description || "",
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
                      <SectionButtonBar>
                        <Button
                          type="button"
                          name="info-cancel"
                          onClick={this.toggleEditting}>
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          name="info-save"
                          disabled={isSubmitting}>
                          Save
                        </Button>
                      </SectionButtonBar>
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
        </Section>
      </React.Fragment>
    )
  }
}

export default TeamInformationSection

import React from "react"
import { Modal, Button } from "polyvolve-ui/lib"
import {
  modalStyle,
  Select,
  cx,
  singleStyle,
  componentStyle,
} from "../../lib/reexports"
import { ReviewMaster, User } from "polyvolve-ui/lib/@types"
import { REVIEW_URL } from "../../constants/env"
import { UserActiveActions } from "../../redux/user"

interface Props {
  show: boolean
  onClose: () => void
  linkHash: string
  reviewMasters: ReviewMaster[]
  user: User
  userActiveActions: typeof UserActiveActions
}

interface State {
  selectedMaster?: { value: ReviewMaster; label: string }
}

export default class CreateLinkModal extends React.Component<Props, State> {
  state: State = {}

  getLink = () => REVIEW_URL + "/?id=" + this.props.linkHash

  render(): JSX.Element {
    const { user, show, onClose, reviewMasters, linkHash } = this.props

    const options = reviewMasters.map(rm => {
      return {
        value: rm,
        label: rm.name,
      }
    })

    return (
      <Modal
        isOpen={show}
        onRequestClose={onClose}
        center={false}
        overlayClassName={modalStyle.modalOverlay}
        className={modalStyle.modal}>
        <form className={modalStyle.modalForm}>
          <div className={modalStyle.modalInner}>
            <p className="mb1">
              For which Review Master do you want to retrieve the link?
            </p>
            <Select
              className={cx(
                singleStyle.selectMenu,
                componentStyle.select,
                "mb1"
              )}
              classNamePrefix="pv"
              value={this.state.selectedMaster}
              onChange={value => this.setState({ selectedMaster: value })}
              options={options}
            />
            <Button
              className="mb1"
              name="retrieve-link"
              type="button"
              disabled={!this.state.selectedMaster}
              onClick={() =>
                this.props.userActiveActions.getLinkForReviewMasterRequest({
                  reviewMaster: this.state.selectedMaster.value,
                  user: user,
                })
              }>
              Retrieve
            </Button>
            {linkHash && (
              <p>
                Your link is ready: <a href={this.getLink()}>Copy this</a>
              </p>
            )}
          </div>
        </form>
      </Modal>
    )
  }
}

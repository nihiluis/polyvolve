import * as React from "react"
import Link from "next/link"

import { SelectElementMenuComponent } from "polyvolve-ui/lib/nav/SelectElementMenu";
import { getUserName } from "../../../lib/format"

import * as singleStyle from "../../../style/single.module.scss"
import { User } from "polyvolve-ui/lib/@types"

interface UserItemProps {
  user: User
}
interface UserItemMenuProps extends SelectElementMenuComponent, UserItemProps { }

export const UserItem: React.FC<UserItemProps> = props => (
  <div key={`user-item-${props.user.id}-div`} className={singleStyle.menuListItem}>
    <Link
      href={`/user/[userId]`}
      as={`/user/${props.user.id}`}
      key={`user-item-${props.user.id}-name`}>
      <a key={`user-item-${props.user.id}-a`}>
        {getUserName(props.user)}
      </a>
    </Link>
    <p key={`user-item-${props.user.id}-position`}>{props.user.position}</p>
  </div>
)

export const UserItemMenu: React.FC<UserItemMenuProps> = props => (
  <React.Fragment>
    <a onClick={props.onClick}>{getUserName(props.user)}</a>
    <p className={singleStyle.userItemPosition}>{props.user.position}</p>
  </React.Fragment>
)

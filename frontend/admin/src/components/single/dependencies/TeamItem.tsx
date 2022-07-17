import * as React from "react"

import { Team } from "polyvolve-ui/lib/@types"
import { SelectElementMenuComponent } from "polyvolve-ui/lib/nav/SelectElementMenu"

import Link from "next/link"
import { singleStyle } from "../../../lib/reexports"

interface TeamItemProps {
  team: Team
}

interface TeamItemMenuProps extends SelectElementMenuComponent, TeamItemProps {}

export const TeamItem: React.FC<TeamItemProps> = props => (
  <Link
    href={`/team/[teamId]`}
    as={`/team/${props.team.id}`}
    key={`team-item-${props.team.id}-link`}>
    <a
      key={`team-item-${props.team.id}-a`}
      className={singleStyle.menuListItem}>
      {props.team.name}
    </a>
  </Link>
)

export const TeamItemMenu: React.FC<TeamItemMenuProps> = props => (
  <React.Fragment>
    <a onClick={props.onClick}>{props.team.name}</a>
  </React.Fragment>
)

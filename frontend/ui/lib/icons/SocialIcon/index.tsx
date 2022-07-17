import * as React from "react"
import cx from "classnames"

import { Icon } from ".."

import * as socialIconStyle from "./style.module.scss"

import * as discord from "./discord.svg"
import * as facebook from "./facebook.svg"
import * as github from "./github.svg"
import * as twitter from "./twitter.svg"
import * as youtube from "./youtube.svg"

  export interface Props {
    type: SocialIconType
    link: string
    size?: number
    color?: string
  }

type SocialIconType = "facebook" | "discord" | "github" | "twitter" | "youtube"

export default class SocialIcon extends React.Component<Props, {}> {
  public static defaultProps: Partial<Props> = {
    size: 20,
  }

  icon = (type: SocialIconType): JSX.Element | null => {
    const { size } = this.props

    let classes: string | null = null
    let icon: any
    let title: string

    switch (type) {
      case "facebook":
        classes = cx(socialIconStyle.icon, socialIconStyle.facebook)
        icon = facebook
        title = "Facebook"
        break
      case "discord":
        classes = cx(socialIconStyle.icon, socialIconStyle.discord)
        icon = discord
        title = "Discord"
        break
      case "github":
        classes = cx(socialIconStyle.icon, socialIconStyle.github)
        icon = github
        title = "Github"
        break
      case "twitter":
        classes = cx(socialIconStyle.icon, socialIconStyle.twitter)
        icon = twitter
        title = "Twitter"
        break
      case "youtube":
        classes = cx(socialIconStyle.icon, socialIconStyle.youtube)
        icon = youtube
        title = "Youtube"
        break
      default:
        return null
    }

    return <Icon src={icon} link="#" title={title} className={classes} size={{width: size!, height: size!}} />
  }

  render(): JSX.Element {
    const { type } = this.props

    return (
      <li>
        {this.icon(type)}
      </li>
    )
  }
}

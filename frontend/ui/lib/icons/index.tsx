import * as React from "react"

import GoIcon from "./GoIcon"
import QuestionIcon from "./QuestionIcon"
import StatusIcon from "./StatusIcon"
import SocialIcon from "./SocialIcon"
import MinusIcon from "./MinusIcon"
import PlusIcon from "./PlusIcon"
import InfoIcon from "./InfoIcon"
import Icon, { IconProps } from "./Icon"
import RemoveIcon from "./RemoveIcon"

import * as backIconSrc from "./back.svg"
import * as homeIconSrc from "./home.svg"
import * as upIconSrc from "./up.svg"
import * as downIconSrc from "./down.svg"
import * as nextIconSrc from "./next.svg"

const BackIcon: React.FC<IconProps> = props => (
  <Icon {...props} src={backIconSrc} />
)

const HomeIcon: React.FC<IconProps> = props => (
  <Icon {...props} src={homeIconSrc} />
)

const NextIcon: React.FC<IconProps> = props => (
  <Icon {...props} src={nextIconSrc} />
)

const UpIcon: React.FC<IconProps> = props => (
  <Icon {...props} src={upIconSrc} />
)

const DownIcon: React.FC<IconProps> = props => (
  <Icon {...props} src={downIconSrc} />
)

export {
  GoIcon,
  QuestionIcon,
  StatusIcon,
  SocialIcon,
  MinusIcon,
  PlusIcon,
  Icon,
  InfoIcon,
  BackIcon,
  RemoveIcon,
  UpIcon,
  DownIcon,
  HomeIcon,
  NextIcon,
}

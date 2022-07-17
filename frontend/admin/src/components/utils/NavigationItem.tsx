import { NavigationItem as DefaultNavigationItem } from "polyvolve-ui/lib"

interface Props {
  name?: string
  url?: string
  icon?: any
  index?: boolean
  className?: string
  onClick?: () => void
}

const NavigationItem: React.FunctionComponent<Props> = props => (
  <DefaultNavigationItem {...props} url={props.url} />
)

export default NavigationItem

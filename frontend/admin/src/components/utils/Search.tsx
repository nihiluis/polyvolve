import * as React from "react"
import { navStyle } from "../../lib/reexports"
import PInput from "../ui/PInput"

interface Props {}

interface State {}

export default class Search extends React.Component<Props, State> {
  render(): JSX.Element {
    return (
      <div>
        <PInput
          className={navStyle.searchInput}
          name="searchInput"
          type="text"
          placeholder="Search..."
        />
      </div>
    )
  }
}

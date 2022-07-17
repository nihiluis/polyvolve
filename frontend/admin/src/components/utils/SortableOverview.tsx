import * as React from "react"
import { Line } from "polyvolve-ui/lib"
import { sortableOverviewStyle } from "../../lib/reexports"
import PInput from "../ui/PInput"

interface SortableOverviewItem {
  id: string
}

interface SortableOverviewFilter<Item extends SortableOverviewItem> {
  name: string
  filterItem: (filterInput: string) => Item[]
}

interface Props<Item extends SortableOverviewItem> {
  items: Item[]
  renderItem: (item: Item) => JSX.Element
  filters: SortableOverviewFilter<Item>[]
}

interface State {
  filterValues: { [filterName: string]: string }
}

export default class SortableOverview<
  Item extends SortableOverviewItem
> extends React.Component<Props<Item>, State> {
  constructor(props: Props<Item>) {
    super(props)

    this.state = {
      filterValues: {},
    }
  }

  handleFilterChange = (
    filter: SortableOverviewFilter<Item>
  ): ((event: React.ChangeEvent<HTMLInputElement>) => void) => {
    return event => {
      const newFilterValues = { ...this.state.filterValues }

      newFilterValues[filter.name] = event.target.value

      this.setState({ filterValues: newFilterValues })
    }
  }

  render(): JSX.Element {
    const { items, renderItem, filters } = this.props

    return (
      <div className={sortableOverviewStyle.sortableOverviewContainer}>
        <div
          className={
            sortableOverviewStyle.sortableOverviewFilterContainerWrapper
          }>
          <h4>Filters</h4>
          <div
            className={sortableOverviewStyle.sortableOverviewFilterContainer}>
            {filters.map(filter => (
              <div
                key={`sortableOverviewFilter-${filter.name}`}
                className={sortableOverviewStyle.sortableOverviewFilter}>
                <label>{filter.name}</label>
                <PInput
                  name="mail"
                  type="email"
                  onChange={this.handleFilterChange(filter)}
                  value={this.state.filterValues[filter.name] || ""}
                />
              </div>
            ))}
          </div>
        </div>
        <Line className={sortableOverviewStyle.sortableOverviewLine} />
        <div className={sortableOverviewStyle.sortableOverviewItemContainer}>
          {items.map(item => (
            <div
              key={`sortableOverviewItem-${item.id}`}
              className={sortableOverviewStyle.sortableOverviewItem}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

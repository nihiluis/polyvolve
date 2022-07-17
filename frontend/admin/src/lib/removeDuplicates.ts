const removeDuplicates = <T extends { id: string }>(arr: Array<T>): Array<T> =>
  arr.filter((item, index, self) => self.findIndex(t => t.id === item.id) === index)

export default removeDuplicates

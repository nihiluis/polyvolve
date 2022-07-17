interface HasOrder {
  order: number
}

interface HasName {
  name: string
}

interface HasSurname {
  surname: string
}

export function sortByOrder(hasOrder1: HasOrder, hasOrder2: HasOrder) {
  if (hasOrder1.order > hasOrder2.order) {
    return 1
  }

  if (hasOrder1.order < hasOrder1.order) {
    return -1
  }

  return 0
}

export function sortByName(hasName1: HasName, hasName2: HasName) {
  if (hasName1.name > hasName2.name) {
    return 1
  }

  if (hasName1.name < hasName2.name) {
    return -1
  }

  return 0 
}

export function sortBySurname(hasSurname1: HasSurname, hasSurname2: HasSurname) {
  if (hasSurname1.surname > hasSurname2.surname) {
    return 1
  }

  if (hasSurname1.surname < hasSurname2.surname) {
    return -1
  }

  return 0 
}

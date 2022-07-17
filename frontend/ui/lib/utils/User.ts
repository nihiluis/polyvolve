import { User } from "../@types"

export function getUserName(user: User): string {
  return `${user.name} ${user.surname}`
}

export function getUserHe(user: User): string {
  if (!user.sex) return "he"

  return user.sex === "male" ? "he" : "she"
}

export function getUserHimself(user: User): string {
  if (!user.sex) return "himself"

  return user.sex === "male" ? "himself" : "herself"
}

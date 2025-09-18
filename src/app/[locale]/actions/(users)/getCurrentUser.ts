'use server'
import { getCurrentUser } from "@/services/currentUserService"
import {Permission} from "@/types/permissionsTypes";


export const currentUser = async (locale: string) => {
  const { data } = await getCurrentUser(locale)
  return data
}


export const currentUserPermissionsActions = async (locale: string) => {
  const { data } = await currentUser(locale)
  const actions = data.permissions.map((permission: Permission) => ({
    action: permission.action
  }))
  return actions
}
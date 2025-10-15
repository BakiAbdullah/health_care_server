import { UserRole } from "@prisma/client"

export interface IJwtUserPayload {
  email: string
  role: UserRole
}
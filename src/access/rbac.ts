import type { Access, FieldAccess } from 'payload'

/**
 * Checks if the request is made by an authenticated user with 'admin' role.
 */
export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user && user.role === 'admin')
}

/**
 * Checks if the request is made by an authenticated user with 'admin' or 'staff' role.
 */
export const isAdminOrStaff: Access = ({ req: { user } }) => {
  return Boolean(user && (user.role === 'admin' || user.role === 'staff'))
}

/**
 * Field-level access: Only admin can update this field.
 * Prevents non-admin staff from escalating their own role.
 */
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  return Boolean(user && user.role === 'admin')
}

/**
 * Field-level access: Only admin or staff can read/update this field.
 * Prevents non-staff / public / unauthorized access to clinic-controlled fields.
 */
export const isAdminOrStaffFieldLevel: FieldAccess = ({ req: { user } }) => {
  return Boolean(user && (user.role === 'admin' || user.role === 'staff'))
}

/**
 * User collection access:
 * - Admin can read/update all users.
 * - Non-admin users can only read/update their own profile.
 */
export const isSelfOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return {
    id: {
      equals: user.id,
    },
  }
}

/**
 * Public content read access for active items:
 * - Admin/Staff can read all items (including inactive/draft).
 * - Public visitors can only read items where isActive is true.
 */
export const isPublicActive: Access = ({ req: { user } }) => {
  if (user && (user.role === 'admin' || user.role === 'staff')) {
    return true
  }
  return {
    isActive: {
      equals: true,
    },
  }
}


/**
 * Media read access:
 * - Admin/Staff can read all media (public and private).
 * - Public visitors can only read media where visibility is 'public'.
 */
export const isPublicOrStaffMedia: Access = ({ req: { user } }) => {
  if (user && (user.role === 'admin' || user.role === 'staff')) {
    return true
  }
  return {
    or: [
      {
        visibility: {
          equals: 'public',
        },
      },
      {
        visibility: {
          exists: false,
        },
      },
    ],
  }
}

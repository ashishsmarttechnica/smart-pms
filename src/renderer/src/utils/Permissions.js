export const getPermissions = (permissions) => {
  if (!Array.isArray(permissions)) {
    console.error('Invalid permissions array')
    return { canAddTask: false, canReopenTask: false }
  }

  const canAddTask = permissions.find((perm) => perm.name === 'Add Task')?.value || false
  const canReopenTask = permissions.find((perm) => perm.name === 'Reopen Task')?.value || false

  return { canAddTask, canReopenTask }
}

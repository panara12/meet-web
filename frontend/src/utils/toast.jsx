// src/utils/toast.js
import { toast } from '../routes/distributer/ui/sonner'  // import from YOUR file

export const showSuccess = (message, description = '') => {
  toast.success(message, { description, duration: 3000 })
}

export const showError = (message, description = '') => {
  toast.error(message, { description, duration: 4000 })
}

export const showPromise = (promise, { loading, success, error }) => {
  toast.promise(promise, { loading, success, error })
}
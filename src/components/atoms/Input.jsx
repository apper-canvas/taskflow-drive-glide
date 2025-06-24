import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({ 
  type = 'text',
  label,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}, ref) => {
  const hasIcon = Boolean(icon)
  const hasError = Boolean(error)
  
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      <div className="relative">
        {hasIcon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={16} className="text-surface-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            block w-full rounded-lg border transition-colors duration-200
            ${hasIcon && iconPosition === 'left' ? 'pl-10' : 'pl-3'}
            ${hasIcon && iconPosition === 'right' ? 'pr-10' : 'pr-3'}
            py-2.5 text-surface-900 placeholder-surface-400
            ${hasError 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-surface-300 focus:border-primary focus:ring-primary/20'
            }
            focus:outline-none focus:ring-2
          `}
          {...props}
        />
        {hasIcon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={16} className="text-surface-400" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
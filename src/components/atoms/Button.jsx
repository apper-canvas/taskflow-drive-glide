import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg focus:ring-primary/50',
    secondary: 'bg-surface-100 text-surface-700 hover:bg-surface-200 border border-surface-200 focus:ring-surface-300',
    ghost: 'text-surface-600 hover:bg-surface-100 hover:text-surface-900 focus:ring-surface-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  const IconComponent = icon ? ApperIcon : null
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabledClasses}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <IconComponent name={icon} size={16} className="mr-2" />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <IconComponent name={icon} size={16} className="ml-2" />
      )}
    </motion.button>
  )
}

export default Button
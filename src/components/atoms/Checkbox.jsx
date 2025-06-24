import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Checkbox = ({ 
  checked = false, 
  onChange, 
  disabled = false,
  size = 'md',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }
  
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange && onChange(!checked)}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`
        ${sizes[size]}
        rounded border-2 transition-all duration-200
        flex items-center justify-center
        ${checked 
          ? 'bg-gradient-to-r from-primary to-secondary border-primary text-white' 
          : 'bg-white border-surface-300 hover:border-primary'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-primary/20
        ${className}
      `}
      {...props}
    >
      <motion.div
        initial={false}
        animate={{ 
          scale: checked ? 1 : 0,
          opacity: checked ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
      >
        <ApperIcon name="Check" size={iconSizes[size]} />
      </motion.div>
    </motion.button>
  )
}

export default Checkbox
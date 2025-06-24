import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name="AlertCircle" size={32} className="text-red-500" />
      </div>
      
      <h3 className="text-lg font-heading font-semibold text-surface-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-surface-600 mb-6 max-w-sm mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="primary"
            onClick={onRetry}
            icon="RefreshCw"
          >
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ErrorState
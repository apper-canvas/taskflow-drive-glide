import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex items-center justify-center p-6"
    >
      <div className="text-center max-w-md">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-surface-100 to-surface-200 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="AlertTriangle" size={40} className="text-surface-400" />
          </div>
        </motion.div>
        
        <h1 className="text-3xl font-heading font-bold text-surface-900 mb-2">
          404 - Page Not Found
        </h1>
        
        <p className="text-surface-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            icon="Home"
          >
            Go Home
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            icon="ArrowLeft"
          >
            Go Back
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default NotFound
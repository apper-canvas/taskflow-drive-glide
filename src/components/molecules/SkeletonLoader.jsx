import { motion } from 'framer-motion'

const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-lg border border-surface-200 p-4"
        >
          <div className="animate-pulse flex items-start gap-3">
            <div className="w-5 h-5 bg-surface-200 rounded border-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="h-4 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-3/4"></div>
                <div className="w-12 h-5 bg-surface-200 rounded-full flex-shrink-0"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-surface-200 rounded-full"></div>
                  <div className="h-3 bg-surface-200 rounded w-12"></div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-surface-200 rounded"></div>
                  <div className="h-3 bg-surface-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default SkeletonLoader
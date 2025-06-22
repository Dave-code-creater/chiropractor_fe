import React, { useState, useEffect } from 'react'
import AppRoutes from './routes/AppRoutes'
import TutorialLauncher from './components/tutorial/TutorialLauncher'
import PerformanceMonitor from './components/PerformanceMonitor'
import './App.css'

function App() {
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false)

  // Add keyboard shortcut for performance monitor (Ctrl+Shift+P)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        event.preventDefault()
        setShowPerformanceMonitor(true)
      }
      // Also allow Escape to close
      if (event.key === 'Escape' && showPerformanceMonitor) {
        setShowPerformanceMonitor(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showPerformanceMonitor])

  // Add global performance utilities for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.showPerformanceMonitor = () => setShowPerformanceMonitor(true)
      console.log('🔧 Performance Monitor available:')
      console.log('- Press Ctrl+Shift+P to open')
      console.log('- Or run: window.showPerformanceMonitor()')
      console.log('- Store performance: window.storePerformance')
      console.log('- API performance: window.apiPerformance')
    }
  }, [])

  return (
    <div className="app">
      <AppRoutes />
      <TutorialLauncher variant="fab" />
      <PerformanceMonitor 
        isVisible={showPerformanceMonitor} 
        onClose={() => setShowPerformanceMonitor(false)} 
      />
    </div>
  )
}

export default App

import { useState, useEffect } from 'react'
import { message } from 'antd'

export function useConfig() {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    // 确保services可用
    if (typeof window !== 'undefined' && window.services) {
      const savedConfig = window.services.getConfig()
      setConfig(savedConfig)
    }
  }, [])

  const updateConfig = (key, value) => {
    if (!config) return

    let newConfig
    if (typeof key === 'string') {
      newConfig = { ...config, [key]: value }
    } else if (typeof key === 'object') {
      newConfig = { ...config, ...key }
    } else {
      return
    }

    window.services.updateConfig(newConfig)
    setConfig(newConfig)
  }

  const addSearchPath = path => {
    if (!path || !config) return false

    if (!config.searchPaths.includes(path)) {
      const newConfig = {
        ...config,
        searchPaths: [...config.searchPaths, path],
      }
      window.services.updateConfig(newConfig)
      setConfig(newConfig)
      message.success('添加搜索路径成功')
      return true
    }
    return false
  }

  const removeSearchPath = path => {
    if (!path || !config) return

    const newConfig = {
      ...config,
      searchPaths: config.searchPaths.filter(p => p !== path),
    }
    window.services.updateConfig(newConfig)
    setConfig(newConfig)
    message.success('移除搜索路径成功')
  }

  const addExcludePath = path => {
    if (!path || !config) return false

    if (!config.excludePaths.includes(path)) {
      const newConfig = {
        ...config,
        excludePaths: [...config.excludePaths, path],
      }
      window.services.updateConfig(newConfig)
      setConfig(newConfig)
      message.success('添加排除路径成功')
      return true
    }
    return false
  }

  const removeExcludePath = path => {
    if (!path || !config) return

    const newConfig = {
      ...config,
      excludePaths: config.excludePaths.filter(p => p !== path),
    }
    window.services.updateConfig(newConfig)
    setConfig(newConfig)
    message.success('移除排除路径成功')
  }

  return {
    config,
    updateConfig,
    addSearchPath,
    removeSearchPath,
    addExcludePath,
    removeExcludePath,
  }
}

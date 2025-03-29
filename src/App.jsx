import React, { useState, useEffect } from 'react'
import { message, Button } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import { useConfig } from './hooks/useConfig'
import { useSearch } from './hooks/useSearch'
import { GuideAlert } from './components/GuideAlert'
import { SearchBar } from './components/SearchBar'
import { SearchOptions } from './components/SearchOptions'
import { ResultList } from './components/ResultList'
import { SettingsModal } from './components/SettingsModal'
import './App.css'

function App() {
  const [configVisible, setConfigVisible] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [enterAction, setEnterAction] = useState(null)

  const {
    config,
    updateConfig,
    addSearchPath,
    removeSearchPath,
    addExcludePath,
    removeExcludePath,
  } = useConfig()

  const {
    searchValue,
    setSearchValue,
    searchResults,
    loading,
    selectedIndex,
    setSelectedIndex,
  } = useSearch(config)

  // 获取编辑器配置
  const EDITORS = window.services.getEditors()

  // 加载配置
  useEffect(() => {
    const savedConfig = window.services.getConfig()
    updateConfig(savedConfig)

    // 检查是否是首次使用
    if (window.services.isFirstUse()) {
      setShowGuide(true)
    }

    window.utools.onPluginEnter(action => {
      const { payload } = action
      const result = window.services.parseEditorCommand(payload)
      if (result) {
        setSearchValue(result.searchTerm)
      }
      setEnterAction(action)
    })

    window.utools.onPluginOut(() => {
      setSearchValue('')
      setEnterAction(null)
    })
  }, [])

  // 处理键盘事件
  const handleKeyDown = e => {
    if (searchResults.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          onItemClick(searchResults[selectedIndex])
        }
        break
      default:
        break
    }
  }

  // 添加键盘事件监听
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [searchResults, selectedIndex])

  // 处理编辑器路径更新
  const handleUpdateEditorPath = (editor, value) => {
    const newConfig = {
      ...config,
      editorPaths: {
        ...config.editorPaths,
        [editor]: {
          ...(config.editorPaths?.[editor] || {}),
          [window.services.getPlatform()]: value,
        },
      },
    }
    updateConfig('editorPaths', newConfig.editorPaths)
  }

  // 处理搜索结果点击
  const onItemClick = async item => {
    const payload = enterAction?.payload
    if (!payload) return

    try {
      const result = window.services.parseEditorCommand(payload)
      if (!result) return

      const { editor: editorKey } = result
      const openMethod =
        window.services[
          `openIn${editorKey.charAt(0).toUpperCase() + editorKey.slice(1)}`
        ]

      if (openMethod) {
        await openMethod(item.path)
        message.success(`已在${EDITORS[editorKey].name}中打开`)
      } else {
        message.error(`不支持的编辑器：${editorKey}`)
      }
    } catch (error) {
      message.error('打开失败：' + error.message)
    }
  }

  return (
    <div className='container'>
      {showGuide && (
        <GuideAlert
          onClose={() => setShowGuide(false)}
          onOpenSettings={() => setConfigVisible(true)}
        />
      )}

      <div className='search-container'>
        <SearchBar
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
        {config && (
          <SearchOptions
            config={config}
            onConfigChange={updateConfig}
            loading={loading}
          />
        )}
      </div>

      <ResultList
        loading={loading}
        results={searchResults}
        selectedIndex={selectedIndex}
        onItemClick={onItemClick}
      />

      <Button
        type='text'
        icon={<SettingOutlined />}
        onClick={() => setConfigVisible(true)}
        className='config-button'
      />

      {config && (
        <SettingsModal
          visible={configVisible}
          onCancel={() => setConfigVisible(false)}
          config={config}
          onAddSearchPath={addSearchPath}
          onRemoveSearchPath={removeSearchPath}
          onAddExcludePath={addExcludePath}
          onRemoveExcludePath={removeExcludePath}
          onUpdateEditorPath={handleUpdateEditorPath}
        />
      )}
    </div>
  )
}

export default App

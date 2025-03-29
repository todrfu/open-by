import React, { useState } from 'react'
import { Modal, Input, Button, List, Tag, Tooltip } from 'antd'
import './SettingsModal.css'

export const SettingsModal = ({
  visible,
  onCancel,
  config,
  onAddSearchPath,
  onRemoveSearchPath,
  onAddExcludePath,
  onRemoveExcludePath,
  onUpdateEditorPath,
}) => {
  const [newSearchPath, setNewSearchPath] = useState('')
  const [newExcludePath, setNewExcludePath] = useState('')
  const platform = window.services.getPlatform()
  const EDITORS = window.services.getEditors()

  const handleAddSearchPath = () => {
    if (onAddSearchPath(newSearchPath)) {
      setNewSearchPath('')
    }
  }

  const handleAddExcludePath = () => {
    if (onAddExcludePath(newExcludePath)) {
      setNewExcludePath('')
    }
  }

  return (
    <Modal
      title='设置'
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      className='settings-modal'
    >
      <div className='settings-content'>
        <div className='settings-section'>
          <h3>搜索路径设置</h3>
          <div className='input-group'>
            <Input
              placeholder='添加搜索路径'
              value={newSearchPath}
              onChange={e => setNewSearchPath(e.target.value)}
              onPressEnter={handleAddSearchPath}
            />
            <Button type='primary' onClick={handleAddSearchPath}>
              添加
            </Button>
          </div>
          <div className='path-tags'>
            {config?.searchPaths?.map(path => (
              <Tag
                key={path}
                closable={config?.searchPaths?.length > 1}
                onClose={() => onRemoveSearchPath(path)}
              >
                {path}
              </Tag>
            ))}
          </div>
        </div>

        <div className='settings-section'>
          <h3>排除路径设置</h3>
          <div className='input-group'>
            <Input
              placeholder='添加排除路径'
              value={newExcludePath}
              onChange={e => setNewExcludePath(e.target.value)}
              onPressEnter={handleAddExcludePath}
            />
            <Button type='primary' onClick={handleAddExcludePath}>
              添加
            </Button>
          </div>
          <div className='path-tags'>
            {config?.excludePaths?.map(path => (
              <Tag
                key={path}
                closable
                onClose={() => onRemoveExcludePath(path)}
              >
                {path}
              </Tag>
            ))}
          </div>
        </div>

        <div className='settings-section'>
          <h3>编辑器路径设置</h3>
          <List
            dataSource={Object.entries(EDITORS)}
            renderItem={([key, editor]) => (
              <List.Item>
                <div className='editor-item'>
                  <span className='editor-icon'>{editor.icon}</span>
                  <span className='editor-name'>{editor.name}</span>
                  <Input
                    placeholder={`请输入 ${editor.name} 的可执行文件路径`}
                    value={config?.editorPaths?.[key]?.[platform] || ''}
                    onChange={e => onUpdateEditorPath(key, e.target.value)}
                  />
                  <Tooltip title={editor.defaultPaths[platform]}>
                    <Button
                      type='link'
                      onClick={() =>
                        onUpdateEditorPath(key, editor.defaultPaths[platform])
                      }
                    >
                      使用默认路径
                    </Button>
                  </Tooltip>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </Modal>
  )
}

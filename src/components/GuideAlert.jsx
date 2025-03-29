import React from 'react'
import { Alert, Button } from 'antd'
import { SettingOutlined } from '@ant-design/icons'

export function GuideAlert({ onClose, onOpenSettings }) {
  return (
    <Alert
      message='首次使用提示'
      description={
        <div>
          <p>检测到您是首次使用本插件，为了获得更好的搜索体验，建议您：</p>
          <ol>
            <li>
              点击右下角的设置图标 <SettingOutlined />
            </li>
            <li>在"检索目录"中添加您常用的工作目录</li>
            <li>在"排除目录"中添加不需要搜索的目录</li>
          </ol>
          <p>这样可以提高搜索速度并获得更精准的结果</p>
        </div>
      }
      type='info'
      showIcon
      onClose={onClose}
      style={{ marginBottom: 16 }}
      action={
        <Button
          type='primary'
          size='small'
          onClick={() => {
            onOpenSettings()
            onClose()
          }}
        >
          立即设置
        </Button>
      }
    />
  )
}

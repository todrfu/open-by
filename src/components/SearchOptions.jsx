import React from 'react'
import { Space, Checkbox, Tooltip, InputNumber } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

export function SearchOptions({ config, onConfigChange, loading }) {
  return (
    <div className={`search-options ${loading ? 'loading' : ''}`}>
      <Space size={24}>
        <Checkbox.Group
          value={config.searchTypes}
          onChange={types => onConfigChange('searchTypes', types)}
          className='search-types'
        >
          <Space size={16}>
            <Checkbox value='file'>文件</Checkbox>
            <Checkbox value='directory'>文件夹</Checkbox>
            <Checkbox
              checked={config.searchHidden}
              onChange={e => onConfigChange('searchHidden', e.target.checked)}
            >
              隐藏文件
            </Checkbox>
          </Space>
        </Checkbox.Group>
        <Space>
          <Tooltip title='为避免搜索层级过深导致卡顿，可通过【设置】来限制搜索范围'>
            <span className='option-label'>
              <span>搜索深度</span> <QuestionCircleOutlined />
            </span>
          </Tooltip>
          <InputNumber
            min={1}
            max={10}
            value={config.maxDepth}
            onChange={value => onConfigChange('maxDepth', value)}
            size='small'
            style={{ width: 60 }}
          />
        </Space>
      </Space>
    </div>
  )
}

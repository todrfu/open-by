import React from 'react'
import { List } from 'antd'
import { FileOutlined, FolderOutlined } from '@ant-design/icons'

export function ResultList({ loading, results, selectedIndex, onItemClick }) {
  return (
    <List
      loading={loading}
      itemLayout='horizontal'
      dataSource={results}
      locale={{ emptyText: '没有找到任何结果' }}
      renderItem={(item, index) => (
        <List.Item
          key={item.path}
          className={`list-item ${
            index === selectedIndex ? 'list-item-selected' : ''
          }`}
          onClick={() => onItemClick(item)}
        >
          <List.Item.Meta
            avatar={item.isDirectory ? <FolderOutlined /> : <FileOutlined />}
            title={
              <span className={item.isDirectory ? 'is-directory' : 'is-file'}>
                {item.name}
              </span>
            }
            description={item.path}
          />
        </List.Item>
      )}
    />
  )
}

import React from 'react'
import { Input } from 'antd'

export function SearchBar({ value, onChange }) {
  return (
    <Input
      placeholder='输入文件或文件夹名称搜索'
      allowClear
      autoFocus
      value={value}
      onChange={onChange}
      style={{ flex: 1 }}
    />
  )
}

const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const { exec } = require('node:child_process')
const { EDITORS, DEFAULT_CONFIG } = require('./editors')

// 配置文件路径
const configPath = path.join(os.homedir(), '.open-by-app.json')

// 创建services对象
const services = {
  // 获取编辑器配置
  getEditors() {
    return EDITORS
  },
  // 获取当前操作系统平台
  getPlatform() {
    return os.platform()
  },
  // 检查是否首次使用
  isFirstUse() {
    return !fs.existsSync(configPath)
  },
  // 设置已使用标记
  setUsed() {
    if (!fs.existsSync(configPath)) {
      this.updateConfig(DEFAULT_CONFIG)
    }
  },
  // 获取配置
  getConfig() {
    try {
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
        return { ...DEFAULT_CONFIG, ...config }
      }
    } catch (error) {
      console.error('读取配置文件失败：', error)
    }
    return DEFAULT_CONFIG
  },
  // 保存配置
  updateConfig(config) {
    try {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
      return true
    } catch (error) {
      console.error('保存配置文件失败：', error)
      return false
    }
  },
  // 添加搜索路径
  addSearchPath(path) {
    const config = this.getConfig()
    if (!config.searchPaths.includes(path)) {
      config.searchPaths.push(path)
      this.updateConfig(config)
    }
  },
  // 移除搜索路径
  removeSearchPath(path) {
    const config = this.getConfig()
    config.searchPaths = config.searchPaths.filter(p => p !== path)
    this.updateConfig(config)
  },
  // 添加排除路径
  addExcludePath(path) {
    const config = this.getConfig()
    if (!config.excludePaths.includes(path)) {
      config.excludePaths.push(path)
      this.updateConfig(config)
    }
  },
  // 移除排除路径
  removeExcludePath(path) {
    const config = this.getConfig()
    config.excludePaths = config.excludePaths.filter(p => p !== path)
    this.updateConfig(config)
  },
  // 搜索文件和文件夹
  searchFiles(searchTerm) {
    const results = []
    const config = this.getConfig()
    
    function isExcluded(filePath) {
      return config.excludePaths.some(excludePath => 
        filePath.includes(path.sep + excludePath) || filePath.endsWith(excludePath)
      )
    }
    
    function searchInDirectory(dir, depth = 0) {
      if (depth > config.maxDepth) return
      if (isExcluded(dir)) return
      
      try {
        const items = fs.readdirSync(dir)
        for (const item of items) {
          try {
            // 跳过隐藏文件
            if (!config.searchHidden && item.startsWith('.')) continue
            
            const fullPath = path.join(dir, item)
            if (isExcluded(fullPath)) continue
            
            const stats = fs.statSync(fullPath)
            
            if (item.toLowerCase().includes(searchTerm.toLowerCase())) {
              results.push({
                name: item,
                path: fullPath,
                isDirectory: stats.isDirectory(),
                size: stats.size,
                mtime: stats.mtime
              })
            }
            
            if (stats.isDirectory()) {
              searchInDirectory(fullPath, depth + 1)
            }
          } catch (err) {
            console.error(`Error accessing ${dir}/${item}:`, err)
          }
        }
      } catch (err) {
        console.error(`Error reading directory ${dir}:`, err)
      }
    }
    
    // 在所有配置的搜索路径中搜索
    for (const searchPath of config.searchPaths) {
      searchInDirectory(searchPath)
    }
    
    return results
  },
  // 在指定编辑器中打开文件
  async openInEditor(editorKey, filePath) {
    const config = this.getConfig()
    const platform = this.getPlatform()
    const editorPath = config.editorPaths[editorKey]?.[platform]

    if (!editorPath) {
      throw new Error(`未配置 ${EDITORS[editorKey].name} 的路径`)
    }

    if (!fs.existsSync(editorPath)) {
      throw new Error(`${EDITORS[editorKey].name} 路径不存在：${editorPath}`)
    }

    return new Promise((resolve, reject) => {
      let command = ''
      if (platform === 'win32') {
        command = `"${editorPath}" "${filePath}"`
      } else {
        command = `"${editorPath}" "${filePath}"`
      }

      exec(command, (error) => {
        if (error) {
          reject(new Error(`打开 ${EDITORS[editorKey].name} 失败：${error.message}`))
        } else {
          resolve()
        }
      })
    })
  },
  // 解析编辑器命令
  parseEditorCommand(payload) {
    if (!payload) return null;
    
    // 获取所有编辑器的key组成正则表达式
    const editorKeys = Object.keys(EDITORS).join('|');
    const pattern = new RegExp(`^(${editorKeys})\\s*(.*)`, 'i');
    
    const match = payload.match(pattern);
    if (!match) return null;
    
    return {
      editor: match[1].toLowerCase(),
      searchTerm: match[2]
    };
  }
}

// 为每个编辑器创建打开方法
Object.keys(EDITORS).forEach(key => {
  services[`openIn${key.charAt(0).toUpperCase() + key.slice(1)}`] = (filePath) => services.openInEditor(key, filePath)
})

// 将services对象挂载到window对象上
if (typeof window !== 'undefined') {
  window.services = services
}

// 导出services对象
module.exports = services

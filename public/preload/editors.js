const os = require('node:os')

// 编辑器配置
const EDITORS = {
  vscode: {
    name: 'VS Code',
    icon: '📝',
    defaultPaths: {
      darwin: '/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code',
      win32: 'C:\\Users\\{username}\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe',
      linux: '/usr/bin/code'
    }
  },
  cursor: {
    name: 'Cursor',
    icon: '🎯',
    defaultPaths: {
      darwin: '/Applications/Cursor.app/Contents/MacOS/Cursor',
      win32: 'C:\\Users\\{username}\\AppData\\Local\\Programs\\Cursor\\Cursor.exe',
      linux: '/usr/bin/cursor'
    }
  },
  webstorm: {
    name: 'WebStorm',
    icon: '🌐',
    defaultPaths: {
      darwin: '/Applications/WebStorm.app/Contents/MacOS/webstorm',
      win32: 'C:\\Program Files\\JetBrains\\WebStorm\\bin\\webstorm64.exe',
      linux: '/usr/bin/webstorm'
    }
  },
  pycharm: {
    name: 'PyCharm',
    icon: '🐍',
    defaultPaths: {
      darwin: '/Applications/PyCharm.app/Contents/MacOS/pycharm',
      win32: 'C:\\Program Files\\JetBrains\\PyCharm\\bin\\pycharm64.exe',
      linux: '/usr/bin/pycharm'
    }
  },
  goland: {
    name: 'GoLand',
    icon: '🔷',
    defaultPaths: {
      darwin: '/Applications/GoLand.app/Contents/MacOS/goland',
      win32: 'C:\\Program Files\\JetBrains\\GoLand\\bin\\goland64.exe',
      linux: '/usr/bin/goland'
    }
  },
  appcode: {
    name: 'AppCode',
    icon: '📱',
    defaultPaths: {
      darwin: '/Applications/AppCode.app/Contents/MacOS/appcode',
      win32: 'C:\\Program Files\\JetBrains\\AppCode\\bin\\appcode64.exe',
      linux: '/usr/bin/appcode'
    }
  }
}

// 默认配置
const DEFAULT_CONFIG = {
  searchTypes: ['file', 'directory'], // 搜索类型
  searchPaths: [os.homedir()], // 默认搜索用户主目录
  excludePaths: [
    'node_modules',
    '.git',
    '.idea',
    '.vscode',
    '.DS_Store'
  ], // 排除的路径
  maxDepth: 3, // 最大搜索深度
  searchHidden: false, // 是否搜索隐藏文件
  editorPaths: Object.entries(EDITORS).reduce((acc, [key, editor]) => {
    acc[key] = {
      darwin: editor.defaultPaths.darwin,
      win32: editor.defaultPaths.win32,
      linux: editor.defaultPaths.linux
    }
    return acc
  }, {})
}

module.exports = {
  EDITORS,
  DEFAULT_CONFIG
}

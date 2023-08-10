import { SourceMapConsumer } from 'source-map-js'
import { message } from 'antd'
import { getFileMap } from '@/apis/home'
import { storage } from '../Storage'

// 找到以.js结尾的fileName
function matchStr(str: string): string | undefined {
  if (str.endsWith('.js')) return str.substring(str.lastIndexOf('/') + 1)
}

// 将所有的空格转化为实体字符
function replaceAll(str: string): string {
  return str.replace(new RegExp(' ', 'gm'), '&nbsp;')
}

async function loadSourceMap(fileName: string, projectName: string): Promise<any | undefined> {
  const file = matchStr(fileName)
  if (!file) return
  /** 进行前端缓存 */
  let data = null
  const key = projectName + file + '.map'
  if (storage.get(key)) {
    data = storage.get(key)
  } else {
    const response = await getFileMap({
      fileName: file + '.map',
      projectName
    })
    data = response?.data
    // storage.set(key, response?.data)
  }

  return JSON.parse(data)
}

export const findCodeBySourceMap = async (
  projectName: string,
  { fileName, line, column }: { fileName: string; line: number; column: number },
  callback: (html: string) => void
): Promise<void> => {
  console.log('fileName', fileName)
  const sourceData = await loadSourceMap(fileName, projectName)
  if (!sourceData) return

  const { sourcesContent, sources } = sourceData
  const consumer = await new SourceMapConsumer(sourceData)
  const result = consumer.originalPositionFor({
    line: Number(line),
    column: Number(column)
  })

  /**
   * result结果
   * {
   *   "source": "webpack://myapp/src/views/HomeView.vue",
   *   "line": 24,  // 具体的报错行数
   *   "column": 0, // 具体的报错列数
   *   "name": null
   * }
   * */
  if (result.source && result.source.includes('node_modules')) {
    // 三方报错解析不了，因为缺少三方的map文件，
    // 比如echart报错 webpack://web-see/node_modules/.pnpm/echarts@5.4.1/node_modules/echarts/lib/util/model.js
    message.error(`源码解析失败: 因为报错来自三方依赖，报错文件为 ${result.source}`)
    return
  }

  let index = sources.indexOf(result.source)

  // 未找到，将sources路径格式化后重新匹配 /./ 替换成 /
  // 测试中发现会有路径中带/./的情况，如 webpack://web-see/./src/main.js
  if (index === -1) {
    const copySources = JSON.parse(JSON.stringify(sources)).map((item: string) =>
      item.replace(/\/.\//g, '/')
    )
    index = copySources.indexOf(result.source)
  }
  console.log('index', index)
  if (index === -1) {
    message.error('源码解析失败')
    return
  }
  const code = sourcesContent[index]
  const codeList = code.split('\n')
  const row = result.line,
    len = codeList.length - 1
  const start = row - 5 >= 0 ? row - 5 : 0, // 将报错代码显示在中间位置
    end = start + 9 >= len ? len : start + 9 // 最多展示10行
  const newLines = []
  let j = 0
  for (let i = start; i <= end; i++) {
    j++
    newLines.push(
      `<div class="code-line ${i + 1 === row ? 'heightlight' : ''}" title="${
        i + 1 === row ? result.source : ''
      }">${j}. ${replaceAll(codeList[i])}</div>`
    )
  }

  const innerHTML = `<div class="errdetail"><div class="errheader">${result.source} at line ${
    result.column
  }:${row}</div><div class="errdetail">${newLines.join('')}</div></div>`
  callback(innerHTML)
}

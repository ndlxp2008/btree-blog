//自动生成sidebar脚本

import fs from 'fs'
import path from 'path'

//获取当前目录
const DIR_PATH = path.resolve()
//白名单，排除不需要的文件
const WHITE_LIST = [
  'index.md',
  'README.md',
  '.vitepress',
  'node_modules',
  'public',
  'package.json',
  'package-lock.json',
  'patches',
  '.husky',
  'tool',
  '.editorconfig',
  '.gitignore',
  '.npmrc',
  '.prettierignore',
  'env.d.ts',
  'pnpm-lock.yaml',
  'postcss.config.js',
  'tailwind.config.js',
  'tsconfig.json',
]
//判断是否为文件夹
const isDirectory = (path) => fs.lstatSync(path).isDirectory()

//取差值
const intersections = (arr1, arr2) =>
  Array.from(new Set(arr1.filter((item) => !new Set(arr2).has(item))))
//把方法导出并使用
function getList(parmas, path1, pathname) {
  const res = []
  //遍历文件
  for (let file in parmas) {
    //拼接文件路径
    const dir = path.join(path1, parmas[file])
    const isDir = isDirectory(dir)
    if (isDir) {
      const files = fs.readdirSync(dir)
      res.push({
        text: parmas[file],
        collapsible: true,
        items: getList(files, dir, `${pathname}/${parmas[file]}`),
      })
    } else {
      const name = path.basename(parmas[file])
      //排除非md文件
      const suffix = path.extname(parmas[file])
      if (suffix !== '.md') {
        continue
      }
      let link = `${pathname}${name}`
      link = link.replace('/docs', '').replace('.md', '')
      res.push({
        text: name.replace('.md', ''),
        link: link,
      })
    }
  }
  //目录排序
  var resSort = res.sort((a, b) => {
    var aNum = a.text.split('-')[0]
    var bNum = b.text.split('-')[0]
    return aNum - bNum
  })
  return resSort
}
export const setSidebar = (pathname) => {
  //获取当前目录
  const dirPath = path.join(DIR_PATH, pathname)
  //获取当前目录下的所有文件
  const files = fs.readdirSync(dirPath)
  //过滤白名单
  const items = intersections(files, WHITE_LIST)
  console.log(getList(items, dirPath, pathname))
  //返回目录
  return getList(items, dirPath, pathname)
}

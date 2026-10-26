import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const projectsDirectory = path.join(process.cwd(), 'src/data/projects')

export function getSortedProjectsData() {
  const fileNames = fs.readdirSync(projectsDirectory)
  
  const allData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, '')
    const fullPath = path.join(projectsDirectory, fileName)
    
    // ✅ Corrected: readFileSync, not readdirSync
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const matterResult = matter(fileContents)

    return {
      id,
      ...matterResult.data,     // iframe and all other fields are included
    }
  })

  return allData.sort((a, b) => (a.id > b.id ? 1 : -1))
}

export function getRelatedProjects(current_id) {
  const fileNames = fs.readdirSync(projectsDirectory)
  const allData = []

  fileNames.forEach(fileName => {
    const id = fileName.replace(/\.md$/, '')
    if (id === current_id) return

    const fullPath = path.join(projectsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const matterResult = matter(fileContents)

    allData.push({
      id,
      ...matterResult.data,
    })
  })

  return allData.sort((a, b) => (a.category > b.category ? 1 : -1))
}

export function getAllProjectsIds() {
  const fileNames = fs.readdirSync(projectsDirectory)

  return fileNames.map(fileName => ({
    params: {
      id: fileName.replace(/\.md$/, '')
    }
  }))
}

export async function getProjectData(id) {
  const fullPath = path.join(projectsDirectory, `${id}.md`)

  if (!fs.existsSync(fullPath)) return null

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)

  return {
    id,
    contentHtml: processedContent.toString(),
    ...matterResult.data,
  }
}
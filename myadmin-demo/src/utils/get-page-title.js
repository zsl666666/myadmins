import defaultSettings from '@/settings'

// const title = defaultSettings.title || 'Vue Admin Template'
const title = defaultSettings.title || '后台管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    if(pageTitle == '后台管理系统'){
      return `${pageTitle}`
    }
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

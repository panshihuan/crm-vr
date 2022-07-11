/*
* 时间处理器
* type: 0 年月日时分秒 1 年月日（默认0）
* */

export function formatDate(date, type) {
  if (date) {
    const d = new Date(date)
    const h = d.getFullYear()
    const m = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
    const dd = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()
    const hh = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()
    const mm = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()
    const ss = d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds()
    return [`${h}-${m}-${dd} ${hh}:${mm}:${ss}`, `${h}-${m}-${dd}`][type || 0]
  }
  return ''
}

export const formatMonth = (data) => {
  if (!data) {
    return ''
  }
  if (typeof(data) == 'object') {
    data = data.toLocaleDateString()
  }
  const arr = data.split('/')
  const year = arr[0]
  const month = +arr[1] < 10 ? `0${arr[1]}` : arr[1]
  return `${year}/${month}`
}

export const formatDatePlan = (data) => {
  if (!data) {
    return ''
  }
  if (typeof(data) == 'object') {
    data = data.toLocaleDateString()
  }
  const arr = data.split('/')
  const year = arr[0]
  const month = +arr[1] < 10 ? `0${arr[1]}` : arr[1]
  const date = +arr[2] < 10 ? `0${arr[2]}` : arr[2]
  return `${year}/${month}/${date}`
}

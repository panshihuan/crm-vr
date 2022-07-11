export const valueToLabel = (value, arr) => {
  return arr.find(item => item.value === value).label
}

export const formatText = (arr, text='label', val='value') => {
  if (arr && arr.length) {
    return arr.reduce((pre, cur) => {
      pre.push({
        text: cur[text],
        value: cur[val],
      })
      return pre
    }, [])
  }
}



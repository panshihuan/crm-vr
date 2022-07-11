export const applyDrag = (arr, dragResult) => {
    const { removedIndex, addedIndex, payload } = dragResult
    if (removedIndex === null && addedIndex === null) return arr
  
    const result = [...arr]
    let itemToAdd = payload
  
    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0]
    }
  
    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd)
    }
  
    return result
  }

export const arrMove = (arr, oldIndex, newIndex) => {
    if (newIndex >= arr.length) {
        let i = newIndex - arr.length + 1;
        while (i--) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
}

export const flatFunc = (arrBase=[], keyBase) => {
    let result = []
    function flat (arr, key) {
      arr.map((cur) => {
        if (keyBase) {
          if (Array.isArray(cur[key])) {
            const f = cur[key]
            cur[key] = null
            result = result.concat(cur)
            flat(f)
          } else {
            result = result.concat(cur)
          }
        } else {
          result = result.concat(Array.isArray(cur) ? flat(cur) : cur)
        }
        return result
      }, [])
    }
    flat(arrBase, keyBase)
    return result;
}
export const shuffle = arr => {
  const candidates = Array.prototype.slice.call(arr)
  let res = []
  while (candidates.length > 0) {
    const next = candidates.splice(
      Math.floor(Math.random() * candidates.length),
      1
    )
    res = res.concat(next)
  }
  return res
}

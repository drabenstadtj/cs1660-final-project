// Generates a deterministic green-family gradient from a postId string
export function thumbStyle(id = '') {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  // Keep hue in 100–170 range (yellow-green → teal-green) for on-brand variety
  const hue1 = 100 + (Math.abs(hash) % 70)
  const hue2 = 100 + (Math.abs(hash >> 4) % 70)
  const light1 = 22 + (Math.abs(hash >> 8) % 18)   // 22–40% (dark)
  const light2 = 38 + (Math.abs(hash >> 12) % 22)  // 38–60% (mid)
  const angle = Math.abs(hash >> 2) % 360
  return {
    background: `linear-gradient(${angle}deg, hsl(${hue1},65%,${light1}%), hsl(${hue2},70%,${light2}%))`
  }
}

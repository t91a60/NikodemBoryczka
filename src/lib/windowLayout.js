export const defaultPositions = {
  terminal: { left: 80, top: 60 },
  projects: { left: 240, top: 80 },
  about: { left: 140, top: 120 },
}

export function fitWindowPosition(position, width, height, bounds) {
  return {
    left: Math.max(0, Math.min(Number.isFinite(position?.left) ? position.left : 0, bounds.width - width)),
    top: Math.max(0, Math.min(Number.isFinite(position?.top) ? position.top : 0, bounds.height - height)),
  }
}

export function arrangeWindowPositions(ids, bounds, configs) {
  return Object.fromEntries(ids.map((id, index) => [id, fitWindowPosition(
    { left: 80 + index * 40, top: 24 + index * 32 },
    Math.min(configs[id].width, bounds.width),
    Math.min(configs[id].height, bounds.height),
    bounds,
  )]))
}

import { toPng } from 'html-to-image'

export async function exportNodeAsPng(node, filename = 'scheduling-summary.png') {
  if (!node) {
    throw new Error('Dashboard is not ready to export.')
  }

  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left',
    },
  })

  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}

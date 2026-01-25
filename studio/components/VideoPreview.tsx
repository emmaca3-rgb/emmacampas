export function getVideoID(link: string) {
  const url = new URL(link)
  const params = new URLSearchParams(url.search)
  return params.get('v')
}

type VideoPreviewProps = {
  link: string
  title: string
}

export default function VideoPreview({link, title}: VideoPreviewProps) {
  const id = getVideoID(link)
  const src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`
  return <img src={src} alt={`Preview of ${title}`} style={{objectFit: 'cover'}} />
}

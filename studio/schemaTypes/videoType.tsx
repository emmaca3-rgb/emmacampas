import {defineField, defineType} from 'sanity'
import {baseLanguage} from './localeStringType'
import VideoPreview from '../components/VideoPreview'

export const videoType = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  fields: [
    defineField({
      title: 'Video Title',
      name: 'title',
      type: 'localeString',
    }),
    defineField({
      title: 'Video Link',
      name: 'link',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      link: 'link',
    },
    prepare({title, link}) {
      return {
        title: title[baseLanguage?.value as string],
        media: <VideoPreview link={link} title={title[baseLanguage?.value as string]} />,
      }
    },
  },
})

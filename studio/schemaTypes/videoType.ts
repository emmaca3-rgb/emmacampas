import {defineField, defineType} from 'sanity'
import {baseLanguage} from './localeStringType'

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
    },
    prepare({title}) {
      return {
        title: title[baseLanguage?.value as string],
      }
    },
  },
})

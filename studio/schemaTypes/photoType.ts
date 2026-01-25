import {defineField, defineType} from 'sanity'

export const photoType = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    defineField({
      title: 'Image',
      name: 'image',
      type: 'image',
    }),
    defineField({
      title: 'Photo Caption',
      name: 'caption',
      type: 'string',
    }),
    defineField({
      title: 'Photo Attribution',
      name: 'attribution',
      type: 'string',
    }),
  ],
})

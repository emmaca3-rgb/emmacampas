import {defineField, defineType} from 'sanity'

export const photoType = defineType({
  name: 'photo',
  title: 'Photos',
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

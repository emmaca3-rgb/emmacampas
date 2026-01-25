import {defineField, defineType} from 'sanity'

export const textBlockType = defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
    }),
    defineField({
      title: 'Picture',
      name: 'picture',
      type: 'reference',
      to: [{type: 'photo'}],
    }),
    defineField({
      title: 'Content',
      name: 'content',
      type: 'markdown',
    }),
  ],
})

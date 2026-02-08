import {defineField, defineType} from 'sanity'

export const quoteType = defineType({
  name: 'quote',
  title: 'Quotes',
  type: 'document',
  fields: [
    defineField({
      title: 'Quote Text',
      name: 'text',
      type: 'localeText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Quote Source',
      name: 'source',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Quote Link',
      name: 'link',
      type: 'url',
    }),
  ],
})

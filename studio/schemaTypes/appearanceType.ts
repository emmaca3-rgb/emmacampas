import {defineField, defineType} from 'sanity'
import {baseLanguage} from './localeStringType'

export const appearanceType = defineType({
  name: 'appearance',
  title: 'Appearances',
  type: 'document',
  fields: [
    defineField({
      title: 'Link',
      name: 'link',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Date',
      name: 'date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'localeText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Description',
      name: 'description',
      type: 'localeText',
      validation: (rule) => rule.required(),
    }),
  ],
})

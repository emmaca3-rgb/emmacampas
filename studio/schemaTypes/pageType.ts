import {defineField, defineType, defineArrayMember} from 'sanity'
import {BlockContentIcon} from '@sanity/icons'
import {supportedLanguages} from './localeStringType'

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      title: 'Page ID',
      name: 'id',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'language',
      type: 'string',
      validation: (rule) => rule.required(),
      initialValue: 'en',
      options: {
        list: supportedLanguages,
      },
    }),
    defineField({
      title: 'Page Title',
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Page Subtitle',
      name: 'subtitle',
      type: 'string',
    }),
    defineField({
      title: 'Cover',
      name: 'cover',
      type: 'reference',
      to: [{type: 'photo'}],
    }),
    defineField({
      title: 'Page Content',
      name: 'body',
      type: 'array',
      of: [defineArrayMember({name: 'textBlock', type: 'textBlock'})],
    }),
  ],
  preview: {
    select: {
      id: 'id',
      title: 'title',
      language: 'language',
      media: 'cover.image',
    },
    prepare({id, title, media, language}) {
      return {
        title: `${id} (${language})`,
        subtitle: title,
        media: media ?? BlockContentIcon,
      }
    },
  },
  orderings: [
    {
      title: 'Page id',
      name: 'idAsc',
      by: [{field: 'id', direction: 'asc'}],
    },
  ],
})

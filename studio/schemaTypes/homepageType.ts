import {defineType, defineField, defineArrayMember} from 'sanity'

export const homepageType = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  options: {
    singleton: true,
  },
  fields: [
    defineField({
      title: 'Social Media',
      name: 'socialLinks',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              title: 'Type',
              name: 'id',
              type: 'string',
              options: {
                list: ['instagram', 'youtube'],
              },
            }),
            defineField({
              title: 'Link',
              name: 'link',
              type: 'url',
            }),
          ],
        }),
      ],
      options: {disableActions: ['duplicate']},
      validation: (rule) => rule.unique(),
    }),
    defineField({
      title: 'Quote',
      name: 'quote',
      type: 'reference',
      to: [{type: 'quote'}],
    }),
    defineField({
      title: 'Introductory Text',
      name: 'intro',
      type: 'localeText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Videos',
      name: 'videos',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'video'}]})],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Homepage'}
    },
  },
})

import {defineType, defineField, defineArrayMember} from 'sanity'

export const galleryType = defineType({
  name: 'gallery',
  title: 'Media',
  type: 'document',
  options: {
    singleton: true,
  },
  fields: [
    defineField({
      title: 'Videos',
      name: 'videos',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'video'}]})],
      options: {
        disableActions: ['duplicate'],
        layout: 'grid',
      },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      title: 'Pictures',
      name: 'pictures',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'photo'}]})],
      options: {disableActions: ['duplicate'], layout: 'grid'},
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Media'}
    },
  },
})

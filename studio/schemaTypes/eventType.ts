import {defineField, defineType} from 'sanity'

export const eventType = defineType({
  name: 'event',
  title: 'Events',
  type: 'document',
  fields: [
    defineField({
      title: 'Event Description',
      name: 'description',
      type: 'string',
    }),
    defineField({
      title: 'Event Location',
      name: 'location',
      type: 'string',
    }),
    defineField({
      title: 'Event Date',
      name: 'date',
      type: 'datetime',
    }),
    defineField({
      title: 'Event Link',
      name: 'link',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      description: 'description',
      location: 'location',
      date: 'date',
    },
    prepare({description, location, date}) {
      return {
        title: `${description} (${new Date(date).toLocaleDateString()})`,
        subtitle: location,
      }
    },
  },
  orderings: [
    {
      title: 'Event Date, New First',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
    {
      title: 'Event Date, Old First',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],
})

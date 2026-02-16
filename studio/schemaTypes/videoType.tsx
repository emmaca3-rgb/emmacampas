import {defineField, defineType} from 'sanity'
import {BlockContentIcon} from '@sanity/icons'
import {baseLanguage} from './localeStringType'
import VideoPreview from '../components/VideoPreview'

const validationMessages = {
  title: 'The English title should be present at least',
  link: 'Video URL should be in the form: https://www.youtube.com/watch?v=xxxxxxxxxxx',
}

function validateLink(link: string | undefined) {
  if (typeof link === 'undefined') {
    return false
  }
  try {
    const url = new URL(link)
    const params = new URLSearchParams(url.search)
    return params.get('v')?.length === 11
  } catch {
    return false
  }
}

export const videoType = defineType({
  name: 'video',
  title: 'Videos',
  type: 'document',
  fields: [
    defineField({
      title: 'Video Title',
      name: 'title',
      type: 'localeString',
      validation: (rule) =>
        rule
          .required()
          .custom(
            (val: undefined | Record<string, string>) =>
              Boolean(val && val[baseLanguage?.value as string]) || validationMessages.title,
          )
          .error(),
    }),
    defineField({
      title: 'Video Link',
      name: 'link',
      type: 'url',
      validation: (rule) =>
        rule
          .required()
          .custom((link) => validateLink(link) || validationMessages.link)
          .error(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      link: 'link',
    },
    prepare({title, link}) {
      const previewTitle = title ? title[baseLanguage?.value as string] : 'Untitled'
      return {
        title: previewTitle,
        media: validateLink(link) ? (
          <VideoPreview link={link} title={previewTitle} />
        ) : (
          <BlockContentIcon />
        ),
      }
    },
  },
})

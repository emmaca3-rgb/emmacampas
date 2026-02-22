import {pageType} from './pageType'
import {eventType} from './eventType'
import {videoType} from './videoType.tsx'
import {photoType} from './photoType'
import {quoteType} from './quoteType'
import {textBlockType} from './textBlockType'
import {getLocaleType} from './localeStringType'
import {homepageType} from './homepageType'
import {galleryType} from './galleryType'
import {appearanceType} from './appearanceType.ts'

export const schemaTypes = [
  homepageType,
  galleryType,
  getLocaleType('string'),
  getLocaleType('text'),
  textBlockType,
  quoteType,
  photoType,
  pageType,
  eventType,
  appearanceType,
  videoType,
]

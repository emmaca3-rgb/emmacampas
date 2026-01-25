import {pageType} from './pageType'
import {eventType} from './eventType'
import {videoType} from './videoType'
import {photoType} from './photoType'
import {quoteType} from './quoteType'
import {textBlockType} from './textBlockType'
import {getLocaleType} from './localeStringType'
import {homepageType} from './homepageType'
import {galleryType} from './galleryType'

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
  videoType,
]

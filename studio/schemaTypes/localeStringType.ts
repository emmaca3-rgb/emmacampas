import {defineType} from 'sanity'

export const supportedLanguages = [
  {title: 'English', value: 'en', isDefault: true},
  {title: 'Spanish', value: 'es'},
  {title: 'Catalan', value: 'ca'},
  {title: 'German', value: 'de'},
]

export const baseLanguage = supportedLanguages.find((l) => l.isDefault)

export function getLocaleType(type: 'string' | 'text' = 'string') {
  return defineType({
    title: `Localized ${type}`,
    name: `locale${type == 'string' ? 'String' : 'Text'}`,
    type: 'object',
    fieldsets: [
      {
        title: 'Translations',
        name: 'translations',
        options: {collapsible: true},
      },
    ],
    fields: supportedLanguages.map((lang) => ({
      title: lang.title,
      name: lang.value,
      type,
      fieldset: lang.isDefault ? undefined : 'translations',
    })),
  })
}

export const localeStringType = defineType({
  title: 'Localized string',
  name: 'localeString',
  type: 'object',
  fieldsets: [
    {
      title: 'Translations',
      name: 'translations',
      options: {collapsible: true},
    },
  ],
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.value,
    type: 'string',
    fieldset: lang.isDefault ? undefined : 'translations',
  })),
})

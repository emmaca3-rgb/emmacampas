import {
  singletonDocumentListItems,
  filteredDocumentListItems,
} from 'sanity-plugin-singleton-management'

export const structure = (S, context) =>
  S.list().items([
    ...singletonDocumentListItems({S, context}), // Auto-generates all singletons
    ...filteredDocumentListItems({S, context}), // Auto-filters singletons from main list
  ])

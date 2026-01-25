import {type StructureBuilder} from 'sanity/structure'

import {filteredDocumentListItems} from 'sanity-plugin-singleton-management'

export const structure = (S: StructureBuilder, context) => {
  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Homepage')
        .child(S.document().schemaType('homepage').documentId('homepage')),
      S.listItem().title('Media').child(S.document().schemaType('gallery').documentId('gallery')),
      ...filteredDocumentListItems({S, context}),
    ])
}

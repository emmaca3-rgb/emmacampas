import {type StructureBuilder, ListItemBuilder} from 'sanity/structure'

import {filteredDocumentListItems} from 'sanity-plugin-singleton-management'

const order = ['page', 'photo', 'video', 'event', 'appearance', 'quote']

export const structure = (S: StructureBuilder, context) => {
  const entities = filteredDocumentListItems({S, context})
  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Homepage')
        .child(S.document().schemaType('homepage').documentId('homepage')),
      S.listItem().title('Media').child(S.document().schemaType('gallery').documentId('gallery')),
      S.divider(),
      ...order.map((id) => entities.find((x) => x.getId() === id) as ListItemBuilder),
    ])
}

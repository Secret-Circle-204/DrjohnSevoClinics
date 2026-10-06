/**
 * Universal Lexical Heading-to-Section Segmenter
 * Parses a Payload Lexical richText document by its heading nodes into semantic section blocks.
 * Enables zero-duplication single-source rendering of rich composite narratives.
 */

export interface ParsedLexicalSection {
  title: string
  paragraphs: string[]
  subDoc?: any
}

export function extractSectionsFromLexical(doc: any): Record<string, ParsedLexicalSection> {
  const result: Record<string, ParsedLexicalSection> = {}
  if (!doc?.root?.children || !Array.isArray(doc.root.children)) {
    return result
  }

  let currentKey = ''
  let currentTitle = ''
  let currentNodes: any[] = []

  for (const node of doc.root.children) {
    if (node.type === 'heading') {
      if (currentKey && currentNodes.length > 0) {
        result[currentKey] = {
          title: currentTitle,
          paragraphs: currentNodes
            .filter((n) => n.type === 'paragraph')
            .map((n) => n.children?.map((c: any) => c.text || '').join('').trim())
            .filter(Boolean),
          subDoc: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              direction: 'ltr',
              children: currentNodes,
            },
          },
        }
      }
      const rawTitle = node.children?.map((c: any) => c.text || '').join('').trim() || ''
      currentTitle = rawTitle
      currentKey = rawTitle.toLowerCase().replace(/[^a-z0-9]/g, '')
      currentNodes = []
    } else {
      currentNodes.push(node)
    }
  }

  if (currentKey && currentNodes.length > 0) {
    result[currentKey] = {
      title: currentTitle,
      paragraphs: currentNodes
        .filter((n) => n.type === 'paragraph')
        .map((n) => n.children?.map((c: any) => c.text || '').join('').trim())
        .filter(Boolean),
      subDoc: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: currentNodes,
        },
      },
    }
  }

  return result
}

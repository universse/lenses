// Modified from https://github.com/geon/geon.github.com/blob/master/_posts/2016-03-03-dsxyliea.md :)

const WORD_REGEXP = /\w+/g

export default function simulateDyslexia (interval) {
  const timeoutId = setInterval(() => {
    const textNodes = window
      .$('*')
      .not('iframe')
      .addBack()
      .not('noscript')
      .not('style')
      .contents()
      .filter(function () {
        return this.nodeType === 3
      })

    const wordsInTextNodes = getWordsInTextNodes(textNodes)

    messUpWords(textNodes, wordsInTextNodes)
  }, interval)

  return () => clearInterval(timeoutId)
}

function getWordsInTextNodes (textNodes) {
  const wordsInTextNodes = []

  for (let i = 0; i < textNodes.length; i++) {
    const textNode = textNodes[i]
    const words = []

    let match

    while ((match = WORD_REGEXP.exec(textNode.nodeValue)) !== null) {
      words.push({ length: match[0].length, position: match.index })
    }

    wordsInTextNodes[i] = words
  }

  return wordsInTextNodes
}

function messUpWords (textNodes, wordsInTextNodes) {
  for (let i = 0; i < textNodes.length; i++) {
    const textNode = textNodes[i]

    for (let j = 0; j < wordsInTextNodes[i].length; j++) {
      if (Math.random() > 1 / 10) {
        continue
      }

      const wordMeta = wordsInTextNodes[i][j]

      const word = textNode.nodeValue.slice(
        wordMeta.position,
        wordMeta.position + wordMeta.length
      )

      const before = textNode.nodeValue.slice(0, wordMeta.position)

      const after = textNode.nodeValue.slice(
        wordMeta.position + wordMeta.length
      )

      textNode.nodeValue = before + messUpWord(word) + after
    }
  }
}

function messUpWord (word) {
  if (word.length < 3) {
    return word
  }
  return word[0] + messUpMessyPart(word.slice(1, -1)) + word[word.length - 1]
}

function messUpMessyPart (messyPart) {
  if (messyPart.length < 2) {
    return messyPart
  }

  let a, b

  while (!(a < b)) {
    a = randomInt(0, messyPart.length - 1)
    b = randomInt(0, messyPart.length - 1)
  }

  return (
    messyPart.slice(0, a) +
    messyPart[b] +
    messyPart.slice(a + 1, b) +
    messyPart[a] +
    messyPart.slice(b + 1)
  )
}

function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

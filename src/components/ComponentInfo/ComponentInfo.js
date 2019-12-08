import React from 'react'
import PropTypes from 'prop-types'

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

const RE_OBJECTOF = /(?:React\.)?(?:PropTypes\.)?objectOf\((?:React\.)?(?:PropTypes\.)?(\w+)\)/

function humanizeProp (type) {
  switch (type.name.toLowerCase()) {
    case 'bool':
      return 'Boolean'

    case 'func':
      return 'Function'

    case 'instanceof':
      return `Class(${type.value})`

    case 'arrayof':
      return `Array(${humanizeProp(type.value)})`

    case 'objectof':
      return `ObjectOf(${capitalize(type.value.name)})`

    case 'enum':
      return type.value.map(v => `${v.value}`).join(' │ ')

    case 'union':
      return type.value.map(v => `${humanizeProp(v)}`).join(' │ ')

    case 'shape': {
      const shape = type.value
      const rst = {}
      Object.keys(shape).forEach(key => {
        rst[key] = humanizeProp(shape[key])
      })
      return JSON.stringify(rst, null, 2).replace(/"/g, '')
    }

    case 'custom': {
      const raw = type.raw

      if (raw.includes('function') || raw.includes('=>')) {
        return 'Custom(Function)'
      }

      if (raw.toLowerCase().includes('objectof')) {
        const m = raw.match(RE_OBJECTOF)

        if (m && m[1]) return `Object(${capitalize(m[1])})`

        return 'ObjectOf'
      }

      return 'Custom'
    }
    default:
      return capitalize(type.name)
  }
}

function renderProp ([prop, { type, required, description }]) {
  return (
    <li key={prop}>
      {prop} - {`${required}`} - {humanizeProp(type)}
    </li>
  )
}

export default function ComponentInfo ({ info: { description = '', props } }) {
  return (
    <div>
      {description && <p>{description}</p>}
      <ul>{Object.entries(props).map(renderProp)}</ul>
    </div>
  )
}

ComponentInfo.propTypes = {
  info: PropTypes.shape({
    props: PropTypes.object.isRequired,
    description: PropTypes.string
  }).isRequired
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ErrorBoundary extends Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError () {
    return { hasError: true }
  }

  static getDerivedStateFromProps ({ hasError }) {
    return { hasError }
  }

  render () {
    const { children, fallback = <></> } = this.props

    if (this.state.hasError) {
      return fallback
    }

    return children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  hasError: PropTypes.bool.isRequired,
  fallback: PropTypes.node
}

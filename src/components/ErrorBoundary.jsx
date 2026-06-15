import { Component } from 'react'

export default class WindowErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex flex-col items-center justify-center h-full p-6 text-center"
          style={{ backgroundColor: 'var(--color-surface-window)' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-lg font-bold"
            style={{ backgroundColor: 'rgba(199,22,43,0.12)', color: 'var(--color-danger)' }}
          >
            !
          </div>
          <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            {this.props.title} crashed
          </h3>
          <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

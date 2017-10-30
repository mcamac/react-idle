import { Component } from "react"

const eventsChanged = (yeoldevents, yonnewevents) =>
  yeoldevents.sort().toString() !== yonnewevents.sort().toString()

export default class Idle extends Component {
  static defaultProps = {
    defaultIdle: false,
    render: () => null,
    onChange: () => {},
    timeout: 1000,
    events: ["mousemove", "mousedown", "keydown", "touchstart", "scroll"]
  }

  state = {
    idle: this.props.defaultIdle
  }

  timeout = null

  componentDidMount() {
    this.attachEvents(this.props.events)
    this.setTimeout()
  }

  componentWillUnmount() {
    this.removeEvents(this.props.events)
  }

  componentDidUpdate(prevProps) {
    if (eventsChanged(prevProps.events, this.props.events)) {
      this.removeEvents(prevProps.events)
      this.attachEvents(this.props.events)
    }
  }

  attachEvents(events) {
    events.forEach(event => {
      window.addEventListener(event, this.handleEvent, true)
    })
  }

  removeEvents(events) {
    events.forEach(event => {
      window.removeEventListener(event, this.handleEvent)
    })
  }

  handleChange(idle) {
    this.props.onChange({ idle })
    this.setState({ idle })
  }

  handleEvent = () => {
    if (this.state.idle) {
      this.handleChange(false)
    }
    clearTimeout(this.timeout)
    this.setTimeout()
  }

  setTimeout() {
    this.timeout = setTimeout(() => {
      this.handleChange(true)
    }, this.props.timeout)
  }

  render() {
    return this.props.render(this.state)
  }
}

import { Component, PropTypes } from 'react';

export default class TextBlock extends Component {
  render() {
    return (<span className="editor-text-block" data-index={this.props.index}>{this.props.text}</span>)
  }
}

TextBlock.propTypes = {
  text: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

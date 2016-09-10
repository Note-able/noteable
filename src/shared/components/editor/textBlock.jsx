import React from 'react';

export default class TextBlock extends React.PureComponent {
  render() {
    return (<span className="editor-text-block" data-index={this.props.index}>{this.props.text}</span>)
  }
}

TextBlock.propTypes = {
  text: React.PropTypes.string.isRequired,
  index: React.PropTypes.number.isRequired,
}
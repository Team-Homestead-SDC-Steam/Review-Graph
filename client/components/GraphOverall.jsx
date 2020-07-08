import React from 'react';

export default class GraphOverall extends React.Component {
  constructor() {
    super();
    this.state = {
      data: { detail: [] },
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const { game } = this.props;
    fetch(`http://localhost:3002/api/reviewcount/detail/${game}`)
      .then((response) => response.json())
      .then((json) => {
        this.setState({ data: json });
      });
  }

  render() {
    const { data } = this.state;
    const months = data.detail.map((month) => (
      <div>
        {month.month}
        : positive:
        {month.positive}
        , negative:
        {month.negative}
      </div>
    ));
    return (
      <div>
        <h2>Overall (Graph)</h2>
        <div>
          { months }
        </div>
      </div>
    );
  }
}

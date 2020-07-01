import React from 'react';

export default class Graph extends React.Component {
  constructor() {
    super();
    this.state = {
      data: { detail: [{ month: 'No reviews for this game' }] },
    };
  }

  componentDidMount() {
    fetch('http://localhost:3001/api/reviewcount/detail/98')
      .then(response => response.json())
      .then(json => {
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
        <h1>Graph dataset</h1>
        <div>
          { months }
        </div>
      </div>
    );
  }
}

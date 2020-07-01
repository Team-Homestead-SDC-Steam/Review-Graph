import React from 'react';
export default class Graph extends React.Component {
  constructor() {
    super();
    this.state = {
      data: { detail: [{ month: 'No reviews for this game' }] },
    };
  }

  componentDidMount() {
    fetch('http://localhost:3001/api/reviewcount/98')
      .then(response => response.json())
      .then(json => {
        this.setState({ data: json });
      });
  }

  // {"summary":"Mixed","percent":64,"positive":3750,"negative":2059,"total":5809}

  render() {
    const { data } = this.state;
    const tip = `${data.percent} of the ${data.total} user reviews for this game are positive.`;
    return (
      <div>
        <h1>Graph dataset</h1>
        <div>
          <h2>
            Overall Reviews:
          </h2>
          <span title={tip}>
            {data.summary}
            &nbsp;
          </span>
          (
          {data.total}
          &nbsp;reviews)&nbsp;
          <span title="This summary uses only reviews written by customers that purchased the game directly from Steam.">
            ?
          </span>

        </div>
      </div>
    );
  }
}

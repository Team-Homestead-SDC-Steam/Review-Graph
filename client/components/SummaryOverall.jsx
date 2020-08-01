import React from 'react';

export default class SummaryOverall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: { summary: 'No reviews for this game', percent: 100, total: 0 },
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const { game } = this.props;
    if (game !== '') {
      fetch(`/api/reviewcount/${game}`)
        .then((response) => response.json())
        .then((json) => {
          this.setState({ data: json });
        });
    }
  }

  // {"summary":"Mixed","percent":64,"positive":3750,"negative":2059,"total":5809}

  render() {
    const { data } = this.state;
    const tip = `${data.percent}% of the ${data.total} user reviews for this game are positive.`;

    function thousands(num) {
      const numParts = num.toString().split('.');
      numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return numParts.join('.');
    }
    return (
      <div>
        <h3>Overall reviews:</h3>
        <span className="rating" title={tip}>
          {data.summary}
        </span>
        <span className="count">
          (
          {thousands(data.total)}
          &nbsp;reviews)
        </span>

        <span className="question" title="This summary uses only reviews written by customers that purchased the game directly from Steam.">
          ?
        </span>
      </div>
    );
  }
}

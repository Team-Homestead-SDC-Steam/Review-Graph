import React from 'react';

export default class GraphRecent extends React.Component {
  constructor() {
    super();
    this.state = {
      data: { detail: [] },
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const { game } = this.props;
    fetch(`http://localhost:3001/api/reviewcount/recent/detail/${game}`)
      .then((response) => response.json())
      .then((json) => {
        this.setState({ data: json });
      });
  }

  render() {
    const { data } = this.state;
    const days = data.detail.map((day) => (
      <div>
        {day.day}
        : positive:
        {day.positive}
        , negative:
        {day.negative}
      </div>
    ));
    return (
      <div>
        <h2>Recent (Graph)</h2>
        <div>
          { days }
        </div>
      </div>
    );
  }
}

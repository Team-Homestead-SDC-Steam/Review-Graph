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
    if (game !== '') {
      fetch(`/api/reviewcount/recent/detail/${game}`)
        .then((response) => response.json())
        .then((json) => {
          this.setState({ data: json });
        });
    }
  }

  render() {
    const formatDay = (day) => `${new Date(day.day).toLocaleString('default', { month: 'short' })} ${new Date(day.day).getDate()}`;
    const formatFull = (day) => `${new Date(day.day).toLocaleString('default', { month: 'long' })} ${new Date(day.day).getDate()}, ${new Date(day.day).getFullYear()}`;
    const { data } = this.state;
    const days = data.detail.map((day) => (
      <tr>
        <td className="date">{formatDay(day)}</td>
        <td className="negative">
          <div style={{ width: `${day.negative * 4}px` }} title={`${day.negative} Negative (${formatFull(day)})`}>
            {day.negative}
          </div>
        </td>
        <td className="positive">
          <div style={{ width: `${day.positive * 4}px` }} title={`${day.positive} Positive (${formatFull(day)})`}>
            {day.positive}
          </div>
        </td>
      </tr>
    ));
    return (
      <div>
        <table>
          { days }
        </table>
      </div>
    );
  }
}

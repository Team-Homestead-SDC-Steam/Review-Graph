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
    if (game !== '') {
      fetch(`/api/reviewcount/detail/${game}`)
        .then((response) => response.json())
        .then((json) => {
          this.setState({ data: json });
        });
    }
  }

  render() {
    const formatDate = (month) => `${new Date(month.month).toLocaleString('default', { month: 'short' })} ${new Date(month.month).getFullYear()}`;
    const formatFull = (month) => `${new Date(month.month).toLocaleString('default', { month: 'long' })} ${new Date(month.month).getDate()}, ${new Date(month.month).getFullYear()}`;
    const { data } = this.state;
    const months = data.detail.map((month) => (
      <tr>
        <td className="date">{formatDate(month)}</td>
        <td className="negative">
          <div style={{ width: `${month.negative / 1.5}px` }} title={`${month.negative} Negative (${formatFull(month)})`}>
            {month.negative}
          </div>
        </td>
        <td className="positive">
          <div style={{ width: `${month.positive / 1.5}px` }} title={`${month.positive} Positive (${formatFull(month)})`}>
            {month.positive}
          </div>
        </td>
      </tr>
    ));
    return (
      <div>
        <table>
          { months }
        </table>
      </div>
    );
  }
}

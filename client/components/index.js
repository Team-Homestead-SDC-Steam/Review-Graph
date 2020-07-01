import React from 'react';
import ReactDOM from 'react-dom';
import OverallSummary from './overallSummary.jsx';
import GraphSummary from './graphSummary.jsx';

ReactDOM.render(<OverallSummary/>, document.getElementById('overallSummary'));
ReactDOM.render(<GraphSummary/>, document.getElementById('graphSummary'));

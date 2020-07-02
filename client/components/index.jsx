import React from 'react';
import ReactDOM from 'react-dom';

import SummaryOverall from './summaryOverall';
import GraphOverall from './graphOverall';
import SummaryRecent from './summaryRecent';
import GraphRecent from './graphRecent';

ReactDOM.render(<SummaryOverall />, document.getElementById('summaryOverall'));
ReactDOM.render(<GraphOverall />, document.getElementById('graphOverall'));
ReactDOM.render(<SummaryRecent />, document.getElementById('summaryRecent'));
ReactDOM.render(<GraphRecent />, document.getElementById('graphRecent'));

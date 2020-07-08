import React from 'react';
import ReactDOM from 'react-dom';

import SummaryOverall from './SummaryOverall';
import GraphOverall from './GraphOverall';
import SummaryRecent from './SummaryRecent';
import GraphRecent from './GraphRecent';

const slashes = window.location.href.split('/');
const gameid = slashes[slashes.length - 1].split('?')[0].split('#')[0];

ReactDOM.render(<SummaryOverall game={gameid} />, document.getElementById('summaryOverall'));
ReactDOM.render(<GraphOverall game={gameid} />, document.getElementById('graphOverall'));
ReactDOM.render(<SummaryRecent game={gameid} />, document.getElementById('summaryRecent'));
ReactDOM.render(<GraphRecent game={gameid} />, document.getElementById('graphRecent'));

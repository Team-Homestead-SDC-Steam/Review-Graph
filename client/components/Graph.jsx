import React from 'react';

import SummaryOverall from './SummaryOverall';
import GraphOverall from './GraphOverall';
import SummaryRecent from './SummaryRecent';
import GraphRecent from './GraphRecent';
import './graph.scss';

const Graph = () => {
  const slashes = window.location.href.split('/');
  const gameId = slashes[slashes.length - 1].split('?')[0].split('#')[0] || 1;

  return (
    <div>
      <h2>CUSTOMER REVIEWS</h2>
      <div className="leftcol overall summary">
        <SummaryOverall game={gameId} />
      </div>
      <div className="leftcol recent summary">
        <SummaryRecent game={gameId} />
      </div>
      <div className="leftcol overall graph">
        <GraphOverall game={gameId} />
      </div>
      <div className="leftcol recent graph">
        <GraphRecent game={gameId} />
      </div>
    </div>
  );
};

export default Graph;

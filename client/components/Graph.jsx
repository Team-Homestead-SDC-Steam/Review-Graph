import React from 'react';

import SummaryOverall from './SummaryOverall';
import GraphOverall from './GraphOverall';
import SummaryRecent from './SummaryRecent';
import GraphRecent from './GraphRecent';

const Graph = () => {
  const slashes = window.location.href.split('/');
  const gameId = slashes[slashes.length - 1].split('?')[0].split('#')[0] || 1;

  return (
    <div>
      <SummaryOverall game={gameId} />
      <GraphOverall game={gameId} />
      <SummaryRecent game={gameId} />
      <GraphRecent game={gameId} />
    </div>
  );
};

export default Graph;

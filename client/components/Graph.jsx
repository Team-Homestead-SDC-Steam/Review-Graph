import React from 'react';

import SummaryOverall from './SummaryOverall';
import GraphOverall from './GraphOverall';
import SummaryRecent from './SummaryRecent';
import GraphRecent from './GraphRecent';

const Graph = () => {
  const slashes = window.location.href.split('/');
  const gameId = slashes[slashes.length - 1].split('?')[0].split('#')[0] ||;
  let serverRoot = 'http://44.233.13.178:3002';
  // serverRoot = 'http://localhost:3002'; // comment out for prod

  return (
    <div>
      <SummaryOverall server={serverRoot} game={gameId} />
      <GraphOverall server={serverRoot} game={gameId} />
      <SummaryRecent server={serverRoot} game={gameId} />
      <GraphRecent server={serverRoot} game={gameId} />
    </div>
  );
};

export default Graph;

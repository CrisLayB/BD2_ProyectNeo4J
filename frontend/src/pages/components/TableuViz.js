import React, { useRef, useEffect } from 'react';

const TableuViz = () => {
  const vizContainer = useRef(null);

  useEffect(() => {
    const vizUrl = 'https://public.tableau.com/app/profile/elean1541/viz/Twitortrix/Sheet1';
    const options = {
      hideTabs: true,
      width: '100%',
      height: '800px'
    };
    const viz = new window.tableau.Viz(vizContainer.current, vizUrl, options);
  }, []);

  return (
    <div ref={vizContainer} />
  );
};

export default TableuViz;
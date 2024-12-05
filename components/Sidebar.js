'use client';

import React from 'react';

export default function Sidebar() {
  const addNode = () => {
    // Node addition logic would go here
    console.log('Add Node');
  };

  return (
    <div className="sidebar">
      <button onClick={addNode}>
        Add Node
      </button>
    </div>
  );
}
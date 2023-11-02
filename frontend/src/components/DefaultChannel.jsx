import React from 'react';
import { Button } from 'react-bootstrap';

const DefaultChannel = ({ id, name, currentChannel, handleCurrentChannel }) => (
  <li key={id} className="nav-item w-100">
    <Button
      onClick={() => handleCurrentChannel(id)}
      type="button"
      className="w-100 rounded-0 text-start btn"
      variant={currentChannel === id ? 'secondary' : null}
    >
      <span className="me-1">#</span>
      {name}
    </Button>
  </li>
);
export default DefaultChannel;

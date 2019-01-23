import React from "react";
import queryString from 'query-string';

const Rentals = ({match, location}) => {
  const result = queryString.parse(location.search)
  console.log(result);
  return (
    <div>
      <h1>Rentals</h1>
    </div>
  );
};

export default Rentals;
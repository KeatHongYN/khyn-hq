/* eslint-disable arrow-body-style */
import React from "react";

const DocumentSection = ({ heading, desc }) => {
  return (
    <div className="pt-20">
      <h2 className="font-bold text-md">{heading}</h2>
      <p className="pt-5 text-sm">{desc}</p>
    </div>
  );
};

export default DocumentSection;

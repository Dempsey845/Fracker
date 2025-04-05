import React from "react";

const imageContainerStyle = {
  marginRight: "10%",
  marginLeft: "10%",
  maxWidth: "700px",

  width: "100%",
  margin: "0 auto",
};

const imageStyle = {
  float: "left",
  marginRight: "15px",
  width: "200px",
  height: "auto",
};

function FloatImage(props) {
  return (
    <div style={imageContainerStyle}>
      <img src={props.imgSrc} style={imageStyle}></img>
      <p>{props.content}</p>
    </div>
  );
}

export default FloatImage;

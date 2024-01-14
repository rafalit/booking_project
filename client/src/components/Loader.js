import React from "react";
import HashLoader from "react-spinners/HashLoader";
import { css } from "@emotion/react";

const Loader = ({ loading }) => {
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  return (
    <div className="loader-container">
      <HashLoader color="#000" loading={loading} size={80} css={override} />
    </div>
  );
};

export default Loader;

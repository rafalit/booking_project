import React from "react";
import HashLoader from "react-spinners/HashLoader";
import { css } from "@emotion/react";

// Komponent Loader
const Loader = ({ loading }) => {
  // Konfiguracja stylu spinnera za pomocą biblioteki emotion
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  // Zwraca div zawierający spinner HashLoader
  return (
    <div className="loader-container">
      {/* HashLoader - animowany spinner */}
      <HashLoader color="#000" loading={loading} size={80} css={override} />
    </div>
  );
};

// Eksportuje komponent Loader do użycia w innych częściach aplikacji
export default Loader;

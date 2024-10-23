import React from 'react';
import { Global, css } from '@emotion/react';

const GlobalStyles = () => (
  <Global
    styles={css`
      body {
        font-family: 'Noto Sans', sans-serif;
      }
    `}
  />
);

export default GlobalStyles;

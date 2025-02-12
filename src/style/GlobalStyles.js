import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background-color: ${props => props.theme.color.GRAY[100]};
    color: ${props => props.theme.color.DARK};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
  
  button {
    font-family: inherit;
  }
`;

export default GlobalStyle;
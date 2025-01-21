import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GlobalStyles from "./style/GlobalStyles.js";
import {ThemeProvider} from "styled-components";
import {theme} from "./style/theme.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ThemeProvider theme={theme}>
          <GlobalStyles />
          <App />
      </ThemeProvider>
  </StrictMode>,
)

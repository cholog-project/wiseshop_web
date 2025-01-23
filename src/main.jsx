import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GlobalStyles from "./style/GlobalStyles.js";
import {ThemeProvider} from "styled-components";
import {theme} from "./style/theme.js";
import {RecoilRoot} from "recoil";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RecoilRoot>
          <ThemeProvider theme={theme}>
              <GlobalStyles />
              <App />
          </ThemeProvider>
      </RecoilRoot>
  </StrictMode>,
)

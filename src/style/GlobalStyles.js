import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background-color: ${(props) => props.theme.color.GRAY[100]};
    color: ${(props) => props.theme.color.DARK};
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

  .w-100 {
    width: 100%;
    }

    .h-100 {
    height: 100%;
    }

    a {
    text-decoration: none;
    text-align: center;
    }

    .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    overflow: auto;
    }

    .max-w-540 {
    max-width: 540px;
    }

    .btn-wrapper {
    padding: 0 24px;
    }

    .btn {
    padding: 11px 22px;
    border: none;
    border-radius:  8px;

    background-color: #f2f4f6;
    color: #4e5968;
    font-weight: 600;
    font-size: 17px;
    cursor: pointer;
    }

    .btn.primary {
    background-color: #3282f6;
    color: #f9fcff;
    }

    .text-center {
    text-align: center;
    }

    .flex {
    display: flex;
    }

    .flex-column {
    display: flex;
    flex-direction: column;
    }

    .justify-center {
    justify-content: center;
    }

    .justify-between {
    justify-content: space-between;
    }

    .align-center {
    align-items: center;
    }

    .confirm-loading {
    margin-top: 72px;
    height: 400px;
    justify-content: space-between;
    }


    .confirm-success {
    display: none;
    margin-top: 72px;
    }

    .button-group {
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
    }

    .title {
    margin-top: 32px;
    margin-bottom: 0;
    color: #191f28;
    font-weight: bold;
    font-size: 24px;
    }

    .description {
    margin-top: 8px;
    color: #4e5968;
    font-size: 17px;
    font-weight: 500;
    }

    .response-section {
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-size: 20px;
    }

    .response-section .response-label {
    font-weight: 600;
    color: #333d48;
    font-size: 17px;
    }

    .response-section .response-text {
    font-weight: 500;
    color: #4e5968;
    font-size: 17px;
    padding-left: 16px;
    word-break: break-word;
    text-align: right;
    }

    .color-grey {
    color: #b0b8c1;
    }
`

export default GlobalStyle

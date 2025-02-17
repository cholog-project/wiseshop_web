// src/components/LoadingSpinner.jsx
import styled, { keyframes } from 'styled-components'

const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${(props) => (props.fullScreen ? '100vh' : '200px')};
  width: 100%;
`

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #002366;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

const LoadingText = styled.p`
  margin-top: 1rem;
  color: #666666;
  font-size: 1rem;
  text-align: center;
`

// eslint-disable-next-line react/prop-types
const LoadingSpinner = ({ fullScreen = false, text = '로딩 중...' }) => {
  return (
    <SpinnerWrapper fullScreen={fullScreen}>
      <div>
        <Spinner />
        {text && <LoadingText>{text}</LoadingText>}
      </div>
    </SpinnerWrapper>
  )
}

export default LoadingSpinner

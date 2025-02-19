// pages/PaymentFail.jsx
import { useSearchParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const FailContainer = styled.div`
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  text-align: center;
`

const PaymentFail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const errorCode = searchParams.get('code')
  const errorMessage = searchParams.get('message')

  return (
    <FailContainer>
      <h2>결제에 실패했습니다</h2>
      <p>에러 코드: {errorCode}</p>
      <p>에러 메시지: {errorMessage}</p>
      <button onClick={() => navigate(-1)}>돌아가기</button>
    </FailContainer>
  )
}

export default PaymentFail

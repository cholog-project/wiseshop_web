import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import axiosInstance from '../api/axiosInstance'
import LoadingSpinner from '../components/LoadingSpinner'

const Container = styled.div`
  max-width: 800px;
  margin: 3rem auto;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 2.5rem;
  color: #333333;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`

const Title = styled.h1`
  margin-bottom: 2.5rem;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: #1a1a1a;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: #002366;
    border-radius: 2px;
  }
`

const DefaultBadge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #002366;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`

const AddressText = styled.p`
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #1a1a1a;
`

const PostalCode = styled.p`
  color: #666666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`

const AddButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #002366;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;

  &:hover {
    background-color: #001844;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 35, 102, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`

const NoAddressText = styled.p`
  text-align: center;
  color: #666666;
  font-size: 1.1rem;
  margin: 2rem 0;
`

const AddressCard = styled.div`
  padding: 1.5rem;
  border: 2px solid ${(props) => (props.isDefault ? '#002366' : '#e2e8f0')};
  border-radius: 12px;
  margin-bottom: 1rem;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

const CardContent = styled.div`
  cursor: pointer;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`

const CardButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`

const DeleteButton = styled(CardButton)`
  flex: 1;
  background-color: #ffffff;
  color: #dc2626;
  border: 2px solid #dc2626;

  &:hover {
    background-color: #dc2626;
    color: #ffffff;
  }
`

const ShippingAddressList = () => {
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/address')
      setAddresses(response.data)
    } catch (error) {
      console.error('배송지 목록 조회 실패:', error)
      alert('배송지 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (addressId, isDefault) => {
    if (isDefault) {
      alert('기본 배송지는 삭제할 수 없습니다.')
      return
    }

    if (!window.confirm('배송지를 삭제하시겠습니까?')) {
      return
    }

    try {
      await axiosInstance.delete(`/address/${addressId}`)
      alert('배송지가 삭제되었습니다.')
      fetchAddresses()
    } catch (error) {
      console.error('배송지 삭제 실패:', error)
      alert('배송지 삭제에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleAddNew = () => {
    navigate('/address/create')
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Container>
      <Title>배송지 관리</Title>

      {addresses.length > 0 ? (
        addresses.map((address) => (
          <AddressCard key={address.id} isDefault={address.isDefault}>
            <CardContent>
              {address.isDefault && <DefaultBadge>기본 배송지</DefaultBadge>}
              <PostalCode>우편번호: {address.postalCode}</PostalCode>
              <AddressText>{address.roadAddress}</AddressText>
              <AddressText>{address.detailAddress}</AddressText>
            </CardContent>

            <ButtonGroup>
              <DeleteButton
                onClick={() => handleDelete(address.id, address.isDefault)}
                disabled={address.isDefault}
              >
                삭제하기
              </DeleteButton>
            </ButtonGroup>
          </AddressCard>
        ))
      ) : (
        <NoAddressText>등록된 배송지가 없습니다.</NoAddressText>
      )}

      <AddButton onClick={handleAddNew}>새 배송지 추가하기</AddButton>
    </Container>
  )
}

export default ShippingAddressList

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import axiosInstance from '../api/axiosInstance'
import noImage from '../assets/no-image.jpg'
import { useRecoilValue } from 'recoil'
import { userState } from '../recoil/atoms'

const Container = styled.div`
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 2rem;
`

const ProductSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`

const ImageSection = styled.div`
  border-radius: 12px;
  overflow: hidden;
`

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
`

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
`

const ProductTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
`

const ProductDescription = styled.p`
  font-size: 1rem;
  color: #666666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`

const ProductPrice = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #002366;
  margin-bottom: 1rem;
`

const StockInfo = styled.p`
  font-size: 1rem;
  color: ${(props) => (props.inStock ? '#1a1a1a' : '#dc2626')};
  margin-bottom: 2rem;
`

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #002366;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #001844;
  }
`

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #1a1a1a;
`

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #002366;
  }
`

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #002366;
  }
`

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;

  button {
    flex: 1;
    padding: 0.75rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;

    &.cancel {
      background-color: #e5e7eb;
      color: #4b5563;
      border: none;

      &:hover {
        background-color: #d1d5db;
      }
    }

    &.save {
      background-color: #002366;
      color: white;
      border: none;

      &:hover {
        background-color: #001844;
      }
    }
  }
`

const LoadingText = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: #666666;
  margin: 2rem 0;
`

const ErrorText = styled.p`
  text-align: center;
  color: #dc2626;
  font-size: 1.1rem;
  margin: 2rem 0;
`

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #b91c1c;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`

const ProductDetail = () => {
  const user = useRecoilValue(userState)
  const navigate = useNavigate()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [editInfo, setEditInfo] = useState({ name: '', description: '' })
  const [editPrice, setEditPrice] = useState({ price: 0, totalQuantity: 0 })
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/products/${id}`)
      setProduct(response.data)
      setError(null)
    } catch (error) {
      console.error('상품 정보 조회 실패:', error)
      setError('상품 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleInfoSubmit = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.patch(`/products/${id}`, editInfo)
      await fetchProduct()
      setShowInfoModal(false)
      alert('상품 정보가 수정되었습니다.')
    } catch (error) {
      console.error('상품 정보 수정 실패:', error)
      alert('상품 정보 수정에 실패했습니다.')
    }
  }

  const handlePriceSubmit = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.patch(`/products/${id}/price`, editPrice)
      await fetchProduct()
      setShowPriceModal(false)
      alert('가격 정보가 수정되었습니다.')
    } catch (error) {
      console.error('가격 정보 수정 실패:', error)
      alert(`가격 정보 수정에 실패했습니다: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleEditInfoClick = () => {
    setEditInfo({ name: product.name, description: product.description })
    setShowInfoModal(true)
  }

  const handleEditPriceClick = () => {
    setEditPrice({ price: product.price, totalQuantity: product.totalQuantity })
    setShowPriceModal(true)
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/products/${id}`)
      alert('상품이 삭제되었습니다.')
      navigate('/') // 홈으로 이동
    } catch (error) {
      console.error('상품 삭제 실패:', error)
      alert(`상품 삭제에 실패했습니다: ${error.response?.data?.message || error.message}`)
    } finally {
      setShowDeleteModal(false)
    }
  }

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원'
  }

  if (loading) {
    return (
      <Container>
        <LoadingText>상품 정보를 불러오는 중입니다...</LoadingText>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <ErrorText>{error}</ErrorText>
      </Container>
    )
  }

  if (!product) {
    return (
      <Container>
        <ErrorText>상품을 찾을 수 없습니다.</ErrorText>
      </Container>
    )
  }

  // 소유자 확인 함수
  const isOwner = () => {
    return user.isLoggedIn && user.id === product.ownerId
  }

  return (
    <Container>
      <ProductSection>
        <ImageSection>
          <ProductImage src={noImage} alt={product.name} />
        </ImageSection>

        <InfoSection>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <ProductTitle>{product.name}</ProductTitle>
            {isOwner() && <EditButton onClick={handleEditInfoClick}>정보 수정</EditButton>}
          </div>
          <ProductDescription>{product.description}</ProductDescription>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <ProductPrice>{formatPrice(product.price)}</ProductPrice>
            {isOwner() && <EditButton onClick={handleEditPriceClick}>가격/수량 수정</EditButton>}
          </div>
          <StockInfo inStock={product.totalQuantity > 0}>재고: {product.totalQuantity}개</StockInfo>
          {isOwner() && (
            <ButtonContainer>
              <DeleteButton onClick={handleDeleteClick}>상품 삭제</DeleteButton>
            </ButtonContainer>
          )}
        </InfoSection>
      </ProductSection>

      {showInfoModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>상품 정보 수정</ModalTitle>
            <Form onSubmit={handleInfoSubmit}>
              <FormGroup>
                <Label>상품명</Label>
                <Input
                  type='text'
                  value={editInfo.name}
                  onChange={(e) => setEditInfo({ ...editInfo, name: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>상품 설명</Label>
                <TextArea
                  value={editInfo.description}
                  onChange={(e) => setEditInfo({ ...editInfo, description: e.target.value })}
                  required
                />
              </FormGroup>
              <ModalButtonGroup>
                <button type='button' className='cancel' onClick={() => setShowInfoModal(false)}>
                  취소
                </button>
                <button type='submit' className='save'>
                  저장
                </button>
              </ModalButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {showPriceModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>가격/수량 수정</ModalTitle>
            <Form onSubmit={handlePriceSubmit}>
              <FormGroup>
                <Label>가격</Label>
                <Input
                  type='number'
                  value={editPrice.price}
                  onChange={(e) => setEditPrice({ ...editPrice, price: parseInt(e.target.value) })}
                  required
                  min='0'
                />
              </FormGroup>
              <FormGroup>
                <Label>재고 수량</Label>
                <Input
                  type='number'
                  value={editPrice.totalQuantity}
                  onChange={(e) =>
                    setEditPrice({ ...editPrice, totalQuantity: parseInt(e.target.value) })
                  }
                  required
                  min='0'
                />
              </FormGroup>
              <ModalButtonGroup>
                <button type='button' className='cancel' onClick={() => setShowPriceModal(false)}>
                  취소
                </button>
                <button type='submit' className='save'>
                  저장
                </button>
              </ModalButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
      {showDeleteModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>상품 삭제</ModalTitle>
            <p style={{ marginBottom: '1.5rem', color: '#666666' }}>
              정말로 이 상품을 삭제하시겠습니까?
              <br />이 작업은 되돌릴 수 없습니다.
            </p>
            <ModalButtonGroup>
              <button type='button' className='cancel' onClick={() => setShowDeleteModal(false)}>
                취소
              </button>
              <button
                type='button'
                className='save'
                onClick={handleDeleteConfirm}
                style={{ backgroundColor: '#dc2626' }}
              >
                삭제
              </button>
            </ModalButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </Container>
  )
}

export default ProductDetail

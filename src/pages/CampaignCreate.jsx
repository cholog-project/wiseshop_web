import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  input {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  /* 텍스트에어리어 등 다른 입력타입도 가능 */
  textarea {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${(props) => props.theme.color.PRIMARY};
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #001844;
  }
`;

const CampaignCreate = () => {
    // 캠페인 정보
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [goalQuantity, setGoalQuantity] = useState("");

    // 상품 정보
    const [productName, setProductName] = useState("");
    const [productDesc, setProductDesc] = useState("");
    const [productPrice, setProductPrice] = useState("");

    // 재고 정보
    const [totalStock, setTotalStock] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // 추후 axios.post("/campaigns", {...}) 와 같은 식으로 API 연동
        const campaignData = {
            startDate,
            endDate,
            goalQuantity,
            productName,
            productDesc,
            productPrice,
            totalStock,
        };
        console.log("등록할 캠페인 데이터:", campaignData);

        alert("(Mock) 캠페인 등록 완료! 콘솔을 확인해보세요.");
    };

    return (
        <Container>
            <Title>캠페인 등록</Title>
            <form onSubmit={handleSubmit}>
                {/* 캠페인 정보 */}
                <FormGroup>
                    <label>펀딩 시작 날짜</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <label>펀딩 종료 날짜</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <label>목표 수량</label>
                    <input
                        type="number"
                        placeholder="목표 수량을 입력해주세요."
                        value={goalQuantity}
                        onChange={(e) => setGoalQuantity(e.target.value)}
                        required
                    />
                </FormGroup>

                {/* 상품 정보 */}
                <FormGroup>
                    <label>상품 이름</label>
                    <input
                        type="text"
                        placeholder="상품 이름 입력"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <label>상품 설명</label>
                    <textarea
                        rows="3"
                        placeholder="상품 상세 설명 입력"
                        value={productDesc}
                        onChange={(e) => setProductDesc(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <label>상품 가격</label>
                    <input
                        type="number"
                        placeholder="상품 가격 입력"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        required
                    />
                </FormGroup>

                {/* 재고 정보 */}
                <FormGroup>
                    <label>재고 수량</label>
                    <input
                        type="number"
                        placeholder="총 재고 수량"
                        value={totalStock}
                        onChange={(e) => setTotalStock(e.target.value)}
                        required
                    />
                </FormGroup>

                <SubmitButton type="submit">등록하기</SubmitButton>
            </form>
        </Container>
    );
}

export default CampaignCreate;

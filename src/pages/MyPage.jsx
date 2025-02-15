import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
    max-width: 800px;
    margin: 3rem auto;
    padding: 2.5rem;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

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
`;

const Section = styled.div`
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1.2rem;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    
    &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 20px;
        background: #002366;
        margin-right: 0.8rem;
        border-radius: 2px;
    }
`;

const InfoGrid = styled.div`
    display: grid;
    gap: 1rem;
`;

const InfoItem = styled.div`
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    
    .label {
        font-size: 0.9rem;
        color: #666666;
        margin-bottom: 0.5rem;
    }
    
    .value {
        font-size: 1.1rem;
        font-weight: 600;
        color: #1a1a1a;
    }
`;

const LinkButton = styled(Link)`
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: #002366;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    margin-top: 1rem;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #001844;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 35, 102, 0.2);
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
`;

const MyPage = () => {
    const user = useRecoilValue(userState);

    return (
        <Container>
            <Title>내 정보</Title>

            <Section>
                <SectionTitle>기본 정보</SectionTitle>
                <InfoGrid>
                    <InfoItem>
                        <div className="label">이름</div>
                        <div className="value">{user.name}</div>
                    </InfoItem>
                    <InfoItem>
                        <div className="label">이메일</div>
                        <div className="value">{user.email}</div>
                    </InfoItem>
                </InfoGrid>
            </Section>

            <Section>
                <SectionTitle>주문 관리</SectionTitle>
                <ButtonGroup>
                    <LinkButton to="/orders">
                        주문 내역 보기
                    </LinkButton>
                </ButtonGroup>
            </Section>

            <Section>
                <SectionTitle>배송지 관리</SectionTitle>
                <ButtonGroup>
                    <LinkButton to="/address">
                        배송지 목록
                    </LinkButton>
                    <LinkButton to="/address/create">
                        새 배송지 추가
                    </LinkButton>
                </ButtonGroup>
            </Section>
        </Container>
    );
};

export default MyPage;

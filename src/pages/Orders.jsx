import { useEffect, useState } from "react";
import styled from "styled-components";
import axiosInstance from "../api/axiosInstance.js";

const Container = styled.div`
    max-width: 800px;
    margin: 2rem auto;
    padding: 1.5rem;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
`;

const Title = styled.h1`
    text-align: center;
    margin-bottom: 1.5rem;
`;

const OrderList = styled.div`
    display: grid;
    gap: 1rem;
`;

const OrderCard = styled.div`
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: #fafafa;
`;

const OrderInfo = styled.div`
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
`;

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get("/orders");
                setOrders(response.data); // 서버에서 받은 주문 데이터를 상태로 저장
                setError(null);
            } catch (err) {
                console.error("주문 목록 로드 실패:", err);
                setError("주문 목록을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div style={{ textAlign: "center", marginTop: "2rem" }}>로딩중...</div>;
    }

    if (error) {
        return <div style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>{error}</div>;
    }

    return (
        <Container>
            <Title>나의 주문 목록</Title>
            <OrderList>
                {orders.map((order) => (
                    <OrderCard key={order.id}>
                        <OrderInfo>상품명: {order.productName}</OrderInfo>
                        <OrderInfo>주문 수량: {order.count}</OrderInfo>
                        {/*<OrderInfo>총 가격: {order.price.toLocaleString()}원</OrderInfo>*/}
                        <OrderInfo>주문 날짜: {order.createdDate}</OrderInfo>
                        {/*<OrderInfo>상태: {order.status}</OrderInfo>*/}
                    </OrderCard>
                ))}
            </OrderList>
        </Container>
    );
};

export default Orders;

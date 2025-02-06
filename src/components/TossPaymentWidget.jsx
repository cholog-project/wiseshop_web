import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

const TossPaymentWidget = ({ orderData }) => {
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      // ------  결제위젯 초기화 ------
      const tossPayments = await loadTossPayments(clientKey);
      // 회원 결제
      const widgets = tossPayments.widgets({
        customerKey: orderData.customerKey || "ANONYMOUS" //TODO : 회원ID에 대한 UUID를 전달받아야 함
      });
      setWidgets(widgets);
    }

    fetchPaymentWidgets();
  }, [orderData.customerKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }
      // ------ 주문의 결제 금액 설정 ------
      await widgets.setAmount({
        currency: "KRW",
        value: orderData.amount
      });
      
      await Promise.all([
        // ------  결제 UI 렌더링 ------
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        }),
        // ------  이용약관 UI 렌더링 ------
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets, orderData.amount]);

  useEffect(() => {
    if (widgets == null) {
      return;
    }
  
    widgets.setAmount(orderData.amount);
  }, [widgets, orderData.amount]);

  return (
    <div className="wrapper">
      <div className="box_section">
        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />
        {/* 결제하기 버튼 */}
        <button
          className="button"
          disabled={!ready}
          onClick={async () => {
            try {
              // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
              // TODO : 하드코딩된 부분 수정
              await widgets.requestPayment({
                orderId: orderData.orderId,
                orderName: orderData.orderName,
                successUrl: window.location.origin + "/success", // TODO : 성공 및 실패 시 리다이렉트 적용
                failUrl: window.location.origin + "/fail",
                customerEmail: orderData.customerEmail || "customer123@gmail.com",
                customerName: orderData.customerName || "고객",
                customerMobilePhone: orderData.customerMobilePhone || "01012341234",
              });
            } catch (error) {
              // 에러 처리하기
              console.error(error);
            }
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
};

export default TossPaymentWidget;

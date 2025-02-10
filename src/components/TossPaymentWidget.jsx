import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { orderDataState } from "../recoil/atoms";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

const TossPaymentWidget = ({ orderData }) => {
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);
  const setOrderData = useSetRecoilState(orderDataState);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      // ------  결제위젯 초기화 ------
      const tossPayments = await loadTossPayments(clientKey);
      // 회원 결제
      const widgets = tossPayments.widgets({
        customerKey: orderData.customerKey
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
        value: Number(orderData.amount)
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
  
    widgets.setAmount({
      currency: "KRW",
      value: orderData.amount
    });
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
              // 결제 요청 전에 orderData를 저장
              setOrderData(orderData);

              await widgets.requestPayment({
                orderId: orderData.orderId,
                orderName: orderData.orderName,
                successUrl: window.location.origin + "/success",
                failUrl: window.location.origin + "/fail",
                customerEmail: orderData.customerEmail,
                customerName: orderData.customerName,
                customerMobilePhone: orderData.customerMobilePhone,
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


"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface TransactionInfo {
  approvalCode: string;
  paymentMethod: string;
  response: string;
  transactionDate: string;
  transactionId: string;
}

function TransactionDetails() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [transactionInfo, setTransactionInfo] = useState<TransactionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (reference) {
      fetch(`/api/donations/${reference}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error fetching transaction details");
          }
          return res.json();
        })
        .then((data) => {
          setTransactionInfo(data);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [reference]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!transactionInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Detalles de la Transacción</h1>
      <p>Referencia: {reference}</p>
      <p>Código de Aprobación: {transactionInfo.approvalCode}</p>
      <p>Método de Pago: {transactionInfo.paymentMethod}</p>
      <p>Respuesta: {transactionInfo.response}</p>
      <p>Fecha de Transacción: {transactionInfo.transactionDate}</p>
      <p>ID de Transacción: {transactionInfo.transactionId}</p>
    </div>
  );
}

export default function ResultPage() {
  return <TransactionDetails />;
}

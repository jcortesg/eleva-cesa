
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "../styles/ResultPage.css";

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
  const [transactionInfo, setTransactionInfo] =
    useState<TransactionInfo | null>(null);
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
    return (
      <div className="error-container">
        <div className="error-card">
          <h1 className="error-title">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!transactionInfo) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <h1 className="loading-title">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="result-container">
      <div className="result-card">
        <h1 className="result-title">
          Detalles de la Transacción
        </h1>
        <div className="result-details">
          <div className="result-detail-item">
            <p className="result-detail-label">Referencia:</p>
            <p className="result-detail-value">{reference}</p>
          </div>
          <div className="result-detail-item">
            <p className="result-detail-label">Código de Aprobación:</p>
            <p className="result-detail-value">{transactionInfo.approvalCode}</p>
          </div>
          <div className="result-detail-item">
            <p className="result-detail-label">Método de Pago:</p>
            <p className="result-detail-value">{transactionInfo.paymentMethod}</p>
          </div>
          <div className="result-detail-item">
            <p className="result-detail-label">Respuesta:</p>
            <p className="result-detail-value">{transactionInfo.response}</p>
          </div>
          <div className="result-detail-item">
            <p className="result-detail-label">Fecha de Transacción:</p>
            <p className="result-detail-value">{transactionInfo.transactionDate}</p>
          </div>
          <div className="result-detail-item">
            <p className="result-detail-label">ID de Transacción:</p>
            <p className="result-detail-value">{transactionInfo.transactionId}</p>
          </div>
        </div>
        <div className="result-button-container">
          <button
            onClick={() => window.history.back()}
            className="result-button"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return <TransactionDetails />;
}

import React from 'react';
import Tabs from './Tabs';
import './CardView.css';

interface Invoice {
  vendor: string;
  status: string;
  statusText: string;
  invoiceNumber: string;
  dueDate: string;
  amount: string;
}

interface CardViewProps {
  invoices: Invoice[];
  view: string;
  setView: (view: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const highlightText = (text: string, query: string) => {
  if (!query) {
    return text;
  }
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? <i key={index} className="search-item">{part}</i> : part
  );
};

const CardView: React.FC<CardViewProps> = ({ invoices, view, setView, activeTab, setActiveTab }) => {
  return (
    <div className="card-view">
      <Tabs view={view} setView={setView} activeTab={activeTab} setActiveTab={setActiveTab} />
      {invoices.map((invoice, index) => (
        <div key={index} className="card">
          <div className="company-name">{invoice.vendor}
            <div className={`status ${invoice.status}`}>{invoice.statusText}</div>
          </div>
          <div>
            <div className="invoice-details">
              <div className="invoice-Number">Invoice Number
                <div className="invoice-Number-value">{invoice.invoiceNumber}</div>
              </div>
              <div className="invoice-Date">Due Date
                <div className="invoice-Date-Value">{invoice.dueDate}</div>
              </div>
              <div className="invoice-Amount">Amount
                <div className="invoice-Amount-value">{invoice.amount}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardView;

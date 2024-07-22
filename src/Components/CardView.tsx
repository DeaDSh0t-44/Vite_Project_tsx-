import React from 'react';
import Tabs from './Tabs';
import './CardView.css';
import { Invoice } from '../types';


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
          <div className="company-name">{invoice.vendorInformation && invoice.vendorInformation.vendorName || 'Unknown Vendor'}
            <div className={`status ${invoice.invoiceDifficulty}`}>
              {invoice.invoiceDifficulty.charAt(0).toUpperCase() +  invoice.invoiceDifficulty.slice(1).toLowerCase()}</div>
          </div>
          <div>
            <div className="invoice-details">
              <div className="invoice-Number">Invoice Number
                <div className="invoice-Number-value">{invoice.invoiceNumber}</div>
              </div>
              <div className="invoice-Date">Due Date
                <div className="invoice-Date-Value">{invoice.dueDate || 'Not Specified'}</div>
              </div>
              <div className="invoice-Amount">Amount
                <div className="invoice-Amount-value">  
                  {typeof invoice.totalAmount === 'number' ? invoice.totalAmount.toFixed(2) : 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardView;

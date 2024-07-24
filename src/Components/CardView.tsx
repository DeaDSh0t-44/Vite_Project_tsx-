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
  searchQuery: string;
}

const CardView: React.FC<CardViewProps> = ({ invoices, view, setView, activeTab, setActiveTab, searchQuery }) => {
  // Function to check if a text matches the search query
  const isMatch = (text: string | number) => text.toString().toLowerCase().includes(searchQuery.toLowerCase());

  // Function to highlight matched text
  const highlightText = (text: string | number) => {
    const str = text.toString();
    if (!searchQuery) {
      return str; // Return text as-is if there's no search query
    }
    const parts = str.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? <span key={index} className="highlight">{part}</span> : part
    );
  };

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(invoice => {
    const vendorName = invoice.vendorInformation?.vendorName || 'Unknown Vendor';
    const invoiceNumber = invoice.invoiceNumber;
    const dueDate = invoice.dueDate || 'Not Specified';
    const totalAmount = typeof invoice.totalAmount === 'number' ? invoice.totalAmount.toFixed(2) : 'N/A';
    const invoiceDifficulty = invoice.invoiceDifficulty;

    // Return true if any field matches the search query
    return isMatch(vendorName) || isMatch(invoiceNumber) || isMatch(dueDate) || isMatch(totalAmount) || isMatch(invoiceDifficulty);
  });

  return (
    <div className="card-view">
      <Tabs view={view} setView={setView} activeTab={activeTab} setActiveTab={setActiveTab} />
      {filteredInvoices.length > 0 ? (
        filteredInvoices.map((invoice, index) => {
          const vendorName = invoice.vendorInformation?.vendorName || 'Unknown Vendor';
          const invoiceNumber = invoice.invoiceNumber;
          const dueDate = invoice.dueDate || 'Not Specified';
          const totalAmount = typeof invoice.totalAmount === 'number' ? `₹ ${invoice.totalAmount.toFixed(2)}` : 'N/A';
          const invoiceDifficulty = invoice.invoiceDifficulty;

          return (
            <div key={index} className="card">
              <div className="company-name">
                {highlightText(vendorName)}
                <div className={`status ${invoiceDifficulty}`}>
                  {invoiceDifficulty.charAt(0).toUpperCase() + invoiceDifficulty.slice(1).toLowerCase()}
                </div>
              </div>
              <div>
                <div className="invoice-details">
                  <div className="invoice-Number">
                    Invoice Number
                    <div className="invoice-Number-value">
                      {highlightText(invoiceNumber)}
                    </div>
                  </div>
                  <div className="invoice-Date">
                    Due Date
                    <div className="invoice-Date-Value">
                      {highlightText(dueDate)}
                    </div>
                  </div>
                  <div className="invoice-Amount">
                    Amount
                    <div className="invoice-Amount-value">
                    {highlightText(totalAmount)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="no-results">No results found</div>
      )}
    </div>
  );
};

export default CardView;
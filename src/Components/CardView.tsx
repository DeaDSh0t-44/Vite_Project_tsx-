import React from 'react';
import Tabs from './Tabs';
import './CardView.css';
import { Invoice} from '../types';
import { ProcessedInvoice } from '../typesProcessed';

interface CardViewProps {
  invoices: Invoice[];
  processedinvoices: ProcessedInvoice[];
  view: string;
  setView: (view: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
}

const CardView: React.FC<CardViewProps> = ({ invoices, processedinvoices, view, setView, activeTab, setActiveTab, searchQuery }) => {
  const isMatch = (text: string | number) => text.toString().toLowerCase().includes(searchQuery.toLowerCase());

  const highlightText = (text: string | number) => {
    const str = text.toString();
    if (!searchQuery) {
      return str; 
    }
    const parts = str.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? <span key={index} className="highlight">{part}</span> : part
    );
  };

  const formatDate = (dateString: string) => {
    const dateObject = new Date(dateString);
  
    const day = dateObject.getDate();
    const monthIndex = dateObject.getMonth();
    const year = dateObject.getFullYear();
  
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
  
    const monthName = months[monthIndex];

    const monthNameFormat = monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
    const dayFormatted = day.toString().padStart(2, '0');
    
    return `${dayFormatted} ${monthNameFormat}, ${year}`;
  };

  const filteredInvoices = invoices.filter(invoice => {
    const vendorName = invoice?.vendorName || 'Unknown Vendor';
    const invoiceNumber = invoice.invoiceNumber;
    const dueDate = (formatDate(invoice.dueDate))|| 'Not Specified';
    const totalAmount = typeof invoice.totalAmount === 'number' ? invoice.totalAmount.toFixed(2) : 'N/A';
    const invoiceDifficulty = invoice.invoiceDifficulty;

    return isMatch(vendorName) || isMatch(invoiceNumber) || isMatch(dueDate) || isMatch(totalAmount) || isMatch(invoiceDifficulty);
  });

  const filteredProcessedInvoices = processedinvoices.filter(processedinvoices => {
    const vendorName = processedinvoices.vendorName || 'Unknown Vendor';
    const invoiceNumber = processedinvoices.invoiceNumber;
    const dueDate = (formatDate(processedinvoices.dueDate)) || 'Not Specified';
    const totalAmount = typeof processedinvoices.totalAmount === 'number' ? processedinvoices.totalAmount.toFixed(2) : 'N/A';
    const invoiceDifficulty = processedinvoices.invoiceDifficulty;

    return isMatch(vendorName) || isMatch(invoiceNumber) || isMatch(dueDate) || isMatch(totalAmount) || isMatch(invoiceDifficulty);
  });

  return (
    <div className="card-view">
      <Tabs view={view} setView={setView} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'inbox' && filteredInvoices.length > 0 ? (
        filteredInvoices.map((invoice, index) => {
          const vendorName = invoice?.vendorName || 'Unknown Vendor';
          const invoiceNumber = invoice.invoiceNumber;
          const dueDate = (formatDate(invoice.dueDate)) || 'Not Specified';
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
                      {highlightText(formatDate(invoice.dueDate || 'Not Specified'))}
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
      ) : activeTab === 'processed' && filteredProcessedInvoices.length > 0 ? (
        filteredProcessedInvoices.map((invoice, index) => {
          const vendorName = invoice.vendorName || 'Unknown Vendor';
          const invoiceNumber = invoice.invoiceNumber;
          const dueDate = (formatDate(invoice.dueDate)) || 'Not Specified';
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
                      {highlightText(formatDate(invoice.dueDate || 'Not Specified'))}
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

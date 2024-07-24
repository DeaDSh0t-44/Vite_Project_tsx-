import React, { useRef, useState, useEffect } from 'react';
import Tabs from './Tabs';
import './ListView.css';
import { Invoice } from '../types';

interface ListViewProps {
  invoices: Invoice[];
  view: string;
  setView: (view: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
}

const ListView: React.FC<ListViewProps> = ({ invoices, view, setView, activeTab, setActiveTab, searchQuery }) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const scroll = (scrollOffset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 0,
        left: scrollOffset,
        behavior: 'smooth',
      });
    }
  };

  const handlePrevClick = () => {
    scroll(-100);
  };

  const handleNextClick = () => {
    scroll(100);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const isMatch = (text: string | number) => text.toString().toLowerCase().includes(searchQuery.toLowerCase());

  const highlightText = (text: string | number) => {
    const str = text.toString();
    const parts = str.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? <span key={index} className="highlight">{part}</span> : part
    );
  };

  const filteredInvoices = invoices.filter(invoice => {
    const vendorName = invoice.vendorInformation?.vendorName || 'Unknown Vendor';
    const invoiceNumber = invoice.invoiceNumber;
    const dueDate = invoice.dueDate || 'Not Specified';
    const totalAmount = typeof invoice.totalAmount === 'number' ? `₹ ${invoice.totalAmount.toFixed(2)}` : 'N/A';
    const invoiceDifficulty = invoice.invoiceDifficulty;

    return isMatch(vendorName) || isMatch(invoiceNumber) || isMatch(dueDate) || isMatch(totalAmount) || isMatch(invoiceDifficulty);
  });

  return (
    <div className="list-view">
      <Tabs view={view} setView={setView} activeTab={activeTab} setActiveTab={setActiveTab} />
      {filteredInvoices.length !== 0 && <div className="table-wrapper" ref={scrollContainerRef}>
        <table className="Table">
          <thead>
            <tr>
              <th className="VendorName">VENDOR NAME</th>
              <th>INVOICE NUMBER</th>
              <th>DUE DATE</th>
              <th>AMOUNT</th>
              <th className="Status">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice, index) => (
                <tr key={index} className={index === filteredInvoices.length - 1 ? 'last-row' : ''}>
                  <td className={`VendorName-Value`}>
                    {highlightText(invoice.vendorInformation?.vendorName || 'Unknown Vendor')}
                  </td>
                  <td className={`Number-Value`}>
                    {highlightText(invoice.invoiceNumber)}
                  </td>
                  <td className={`dueDate-Value`}>
                    {highlightText(invoice.dueDate || 'Not Specified')}
                  </td>
                  <td className={`Amount-Value`}>
                  {highlightText(typeof invoice.totalAmount === 'number' ? `₹ ${invoice.totalAmount.toFixed(2)}` : 'N/A')}
                  </td>
                  <td className={`Status-Value`}>
                    {highlightText(invoice.invoiceDifficulty.charAt(0).toUpperCase() + invoice.invoiceDifficulty.slice(1).toLowerCase())}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="no-results"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>}
      {filteredInvoices.length === 0 && (
        <div className = "no-results">
          No Results found
        </div>
      )}
      { filteredInvoices.length !== 0 && <div className="scroll-buttons">
        <button
          className="scroll-button-Prev"
          onClick={handlePrevClick}
          disabled={isAtStart}
        >
          {'<'} Prev
        </button>
        <button
          className="scroll-button-Next"
          onClick={handleNextClick}
          disabled={isAtEnd}
        >
          Next {'>'}
        </button>
      </div>}
    </div>
  );
};

export default ListView;

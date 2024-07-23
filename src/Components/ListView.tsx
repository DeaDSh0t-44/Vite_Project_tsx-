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

  // Function to check if a text matches the search query
  const isMatch = (text: string | number) => text.toString().toLowerCase().includes(searchQuery.toLowerCase());

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
    <div className="list-view">
      <Tabs view={view} setView={setView} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="table-wrapper" ref={scrollContainerRef}>
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
              filteredInvoices.map((invoice, index) => {
                const vendorName = invoice.vendorInformation?.vendorName || 'Unknown Vendor';
                const invoiceNumber = invoice.invoiceNumber;
                const dueDate = invoice.dueDate || 'Not Specified';
                const totalAmount = typeof invoice.totalAmount === 'number' ? invoice.totalAmount.toFixed(2) : 'N/A';
                const invoiceDifficulty = invoice.invoiceDifficulty;

                const highlightVendorName = isMatch(vendorName);
                const highlightInvoiceNumber = isMatch(invoiceNumber);
                const highlightDueDate = isMatch(dueDate);
                const highlightAmount = isMatch(totalAmount);
                const highlightStatus = isMatch(invoiceDifficulty);

                return (
                  <tr key={index} className={index === filteredInvoices.length - 1 ? 'last-row' : ''}>
                    <td className={`VendorName-Value ${highlightVendorName ? 'highlight' : ''}`}>
                      {vendorName}
                    </td>
                    <td className={`Number-Value ${highlightInvoiceNumber ? 'highlight' : ''}`}>
                      {invoiceNumber}
                    </td>
                    <td className={`dueDate-Value ${highlightDueDate ? 'highlight' : ''}`}>
                      {dueDate}
                    </td>
                    <td className={`Amount-Value ${highlightAmount ? 'highlight' : ''}`}>
                      {totalAmount}
                    </td>
                    <td className={`Status-Value ${highlightStatus ? 'highlight' : ''}`}>
                      {invoiceDifficulty.charAt(0).toUpperCase() + invoiceDifficulty.slice(1).toLowerCase()}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="no-results">No results found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="scroll-buttons">
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
      </div>
    </div>
  );
};

export default ListView;

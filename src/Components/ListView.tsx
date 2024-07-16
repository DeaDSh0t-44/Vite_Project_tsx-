import React, { useRef, useState, useEffect } from 'react';
import Tabs from './Tabs';
import './ListView.css';

interface Invoice {
  vendor: string;
  status: string;
  statusText: string;
  invoiceNumber: string;
  dueDate: string;
  amount: string;
  object: string;
}

interface ListViewProps {
  invoices: Invoice[];
  view: string;
  setView: (view: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ invoices, view, setView, activeTab, setActiveTab }) => {
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

  useEffect(() => {
    console.log('Invoices:', invoices);
  }, [invoices]);

  const highlightText = (text: string, query: string) => {
    if (!query) {
      return text;
    }
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? <strong key={index}>{part}</strong> : part
    );
  };

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
            {invoices.map((invoice, index) => (
              <tr key={index}>
                <td className={`VendorName-Value ${invoice.object}`}>{invoice.vendor}</td>
                <td className={`Number-Value ${invoice.object}`}>{invoice.invoiceNumber}</td>
                <td className={`dueDate-Value ${invoice.object}`}>{invoice.dueDate}</td>
                <td className={`Amount-Value ${invoice.object}`}>{invoice.amount}</td>
                <td className={`Status-Value ${invoice.object}`}>{invoice.statusText}</td>
              </tr>
            ))}
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

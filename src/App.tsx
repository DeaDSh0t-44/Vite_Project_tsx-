import React, { useState, useEffect, ChangeEvent } from 'react';
import CardView from './Components/CardView';
import ListView from './Components/ListView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import { Invoice } from './types';
import { ProcessedInvoice } from './typesProcessed';

const App: React.FC = () => {
  const [view, setView] = useState<string>('card');
  const [activeTab, setActiveTab] = useState<string>('inbox');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [processedinvoices, setProcessedInvoices] = useState<ProcessedInvoice[]>([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshProcessedKey, setRefreshProcessedKey] = useState(0);

  useEffect(() => {
    fetch('https://dev.rubix.api.pantheon-hub.tech/rubix/api/invoice/v1/invoice?invoice_status=DRAFT', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-USER-ID': 'USER240716121722L70GZEH7S9',
        'X-CLIENT-ID': 'CLIENT240619182925MLCJKQGFMN'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('API Data:', data);
        if (data && data.invoiceListingDtos) {
          const extractedInvoices: Invoice[] = data.invoiceListingDtos.map((invoice: any) => ({
            vendorName: invoice.vendorName,
            invoiceDifficulty: invoice.invoiceDifficulty,
            dueDate: invoice.dueDate,
            invoiceNumber: invoice.invoiceNumber,
            poNumbers: invoice.poNumbers,
            invoiceStatus: invoice.invoiceStatus,
            totalAmount: invoice.totalAmount
          }));
          setInvoices(extractedInvoices);
        } else {
          throw new Error('API response does not contain invoiceListingDtos');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error.message);
        setError(error.message);
        setLoading(false);
      });
  }, [refreshKey]);

  useEffect(() => {
    fetch('https://dev.rubix.api.pantheon-hub.tech/rubix/api/invoice/v1/invoice?invoice_status=PROCESSED', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-USER-ID': 'USER240716121722L70GZEH7S9',
        'X-CLIENT-ID': 'CLIENT240619182925MLCJKQGFMN'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('API Processed Data:', data);
        if (data && data.invoiceListingDtos) {
          const extractedProcessedInvoices: ProcessedInvoice[] = data.invoiceListingDtos.map((invoice: any) => ({
            vendorName: invoice.vendorName,
          invoiceDifficulty: invoice.invoiceDifficulty,
          dueDate: invoice.dueDate,
          invoiceNumber: invoice.invoiceNumber,
          poNumbers: invoice.poNumbers,
          totalAmount: invoice.totalAmount,
          invoiceId: invoice.invoiceId,
          currency: invoice.currency,
          invoiceStatus: invoice.invoiceStatus
          }));
          setProcessedInvoices(extractedProcessedInvoices);
        } else {
          throw new Error('API response does not contain invoiceListingDtos');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error.message);
        setError(error.message);
        setLoading(false);
      });
  }, [refreshProcessedKey]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleSyncButtonClick = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutesStr} ${ampm}`;

    setTime(strTime);
    setRefreshKey(prevKey => prevKey + 1);
    setRefreshProcessedKey(prevPeocessedKey => prevPeocessedKey + 1);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const vendorName = invoice.vendorName.toLowerCase();
    const invoiceNumber = invoice.invoiceNumber.toLowerCase();
    const dueDate = invoice.dueDate;
    const invoiceDifficulty = invoice.invoiceDifficulty.toLowerCase();
    const poNumbers = invoice.poNumbers;
    const totalAmount = invoice.totalAmount;
    const invoiceStatus = invoice.invoiceStatus.toLowerCase();
    const queryLower = searchQuery.toLowerCase();

    return ((vendorName && vendorName.includes(queryLower)) ||
           (invoiceNumber && invoiceNumber.includes(queryLower))||
           (dueDate) ||
           (invoiceDifficulty && invoiceDifficulty.includes(queryLower))||
           (poNumbers && poNumbers)||
           (totalAmount)||
           (invoiceStatus && invoiceStatus.includes(queryLower)));
  });

  const filteredProcessedInvoices = processedinvoices.filter(processedinvoices => {
    const vendorName = processedinvoices.vendorName.toLowerCase();
    const invoiceNumber = processedinvoices.invoiceNumber.toLowerCase();
    const dueDate = processedinvoices.dueDate;
    const invoiceDifficulty = processedinvoices.invoiceDifficulty.toLowerCase();
    const poNumbers = processedinvoices.poNumbers;
    const totalAmount = processedinvoices.totalAmount;
    const invoiceStatus = processedinvoices.invoiceStatus.toLowerCase();
    const invoiceId = processedinvoices.invoiceId;
    const currency = processedinvoices.currency.toLowerCase();
    const queryLower = searchQuery.toLowerCase();

    return ((vendorName && vendorName.includes(queryLower)) ||
           (invoiceNumber && invoiceNumber.includes(queryLower))||
           (dueDate) ||
           (invoiceDifficulty && invoiceDifficulty.includes(queryLower))||
           (poNumbers && poNumbers)||
           (totalAmount)||
           (invoiceStatus && invoiceStatus.includes(queryLower)) ||
           (invoiceId) ||
           (currency && currency.includes(queryLower)));
  });

  const clearSearch = () => {
    setSearchQuery('');
    setSearchVisible(false);
    setIsSelected(false);
  };

  const handleToggleSearch = () => {
    setSearchVisible(!searchVisible); 
    setIsSelected(!isSelected); 
    clearSearch(); 
  };

  return (
    <div className="app">
      <div className="head">
        <div className="head-element">
          <header>
            <div className="info">
              <h1 className="Heading">Invoices</h1>
              {time && <div className="Sync">last synced at {time}</div>}
              <button onClick={handleSyncButtonClick} className="Sync-button">
                <FontAwesomeIcon icon={faRotate} />
              </button>
            </div>
            <div className="search-container">
              <button
                onClick={() => {
                  setSearchVisible(!searchVisible);
                  setIsSelected(!isSelected);
                }}
                className={isSelected ? 'search-button' : 'search-button-not-selected'}
              >
                <FontAwesomeIcon icon={faSearch} className={isSelected ? 'search-button-icon' : 'search-button-icon-not-selected'} />
              </button>
            </div>
          </header>
          <div className="LoginInfo"></div>
        </div>
        {searchVisible && ( 
            <div className="search-input-container">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for PO/ Vendor/ Invoice"
              className="search-input"
            />
            <button onClick={clearSearch} className="close-button">
              <FontAwesomeIcon icon={faXmark} className="close-button-icon" />
            </button>
          </div>
        )}
      </div>
      <div className="content">
        {searchVisible && (
          <div className="result">
            Showing results for: <span className = "search-query">{searchQuery}</span> 
          </div>
        )}
        {view === 'card' ? (
          <CardView
          invoices={activeTab === 'inbox' ? filteredInvoices : []}
          processedinvoices={activeTab === 'processed' ? filteredProcessedInvoices : []}
            view={view}
            setView={setView}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
          />
        ) : (
          <ListView
          invoices={activeTab === 'inbox' ? filteredInvoices : []}
          processedinvoices={activeTab === 'processed' ? filteredProcessedInvoices : []}
            view={view}
            setView={setView}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
          />
        )}
      </div>
    </div>
  );
}

export default App;

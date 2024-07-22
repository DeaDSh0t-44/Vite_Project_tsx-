import React, { useState, useEffect } from 'react';
import CardView from './Components/CardView';
import ListView from './Components/ListView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './Components/SearchButton';
import './App.css';
import { Invoice } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<string>('card');
  const [activeTab, setActiveTab] = useState<string>('inbox');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

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
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getTimeIn12HourFormat = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutesStr} ${ampm}`;

    setTime(strTime);
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

    return (vendorName && vendorName.includes(queryLower)) ||
           (invoiceNumber && invoiceNumber.includes(queryLower))||
           (dueDate) ||
           (invoiceDifficulty && invoiceDifficulty.includes(queryLower))||
           (poNumbers && poNumbers)||
           (totalAmount)||
           (invoiceStatus && invoiceStatus.includes(queryLower));
  });

  return (
    <div className="app">
      <div className="head-element">
        <header>
          <div className="info">
            <h1 className="Heading">Invoices</h1>
            {time && <div className="Sync">last synced at {time}</div>}
            <button onClick={getTimeIn12HourFormat} className="Sync-button"><FontAwesomeIcon icon={faRotate} /></button>
          </div>
          <SearchBar onSearch={handleSearch} />
        </header>
        <div className="LoginInfo"></div>
      </div>
      <div className="content">
        {view === 'card' ? (
          <CardView
            invoices={filteredInvoices}
            view={view}
            setView={setView}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ) : (
          <ListView
            invoices={filteredInvoices}
            view={view}
            setView={setView}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </div>
    </div>
  );
}

export default App;

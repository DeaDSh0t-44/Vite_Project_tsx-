import React, { useState } from 'react';
import CardView from './Components/CardView';
import ListView from './Components/ListView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './Components/SearchButton';
import './App.css';

interface Invoice {
  vendor: string;
  invoiceNumber: string;
  dueDate: string;
  amount: string;
  status: string;
  statusText: string;
  object: string;
}

const invoices: Invoice[] = [
  { vendor: 'Simpson and Bros Company', invoiceNumber: '28937625142', dueDate: '23 Dec, 2024', amount: '₹ 67,39,289.19', status: 'few-issues', statusText: 'Few Issues', object: 'notlastchild' },
  { vendor: 'Mango farms by Supriya', invoiceNumber: '28937625142', dueDate: '23 Dec, 2024', amount: '₹ 67,39,289.19', status: 'no-issues', statusText: 'No Issues', object: 'notlastchild' },
  { vendor: 'Guns n Roses', invoiceNumber: '28937625142', dueDate: '23 Dec, 2024', amount: '₹ 67,39,289.19', status: 'no-issues', statusText: 'No Issues', object: 'notlastchild' },
  { vendor: 'Guns n Roses', invoiceNumber: '28937625142', dueDate: '23 Dec, 2024', amount: '₹ 67,39,289.19', status: 'no-issues', statusText: 'No Issues', object: 'notlastchild' },
  { vendor: 'Simpson and Bros Company', invoiceNumber: '28937625142', dueDate: '23 Dec, 2024', amount: '₹ 67,39,289.19', status: 'few-issues', statusText: 'Few Issues', object: 'notlastchild' },
  { vendor: 'Simpson and Bros Company', invoiceNumber: '28937625142', dueDate: '23 Dec, 2024', amount: '₹ 67,39,289.19', status: 'no-issues', statusText: 'No Issues', object: 'notlastchild' },
  { vendor: 'Simpson and Bros Company', invoiceNumber: '28937625142', dueDate: '23 Dec, 2024', amount: '₹ 67,39,289.19', status: 'few-issues', statusText: 'Few Issues', object: 'notlastchild' },
  { vendor: 'Simpson and Bros Company', invoiceNumber: '28937625142', dueDate: '23 Dec, 2024', amount: '₹ 67,39,289.19', status: 'no-issues', statusText: 'No Issues', object: 'notlastchild' },
  { vendor: 'Simpson and Bros Company', invoiceNumber: '28937625142', dueDate: '23 Dec, 2024', amount: '₹ 67,39,289.19', status: 'no-issues', statusText: 'No Issues', object: 'notlastchild' },
  { vendor: 'Simpson and Bros Company', invoiceNumber: '28937625142', dueDate: '23 Dec, 2024', amount: '₹ 67,39,289.19', status: 'few-issues', statusText: 'Few Issues', object: 'lastchild' }
];

const App: React.FC = () => {
  const [view, setView] = useState<string>('card');
  const [activeTab, setActiveTab] = useState<string>('inbox');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [time, setTime] = useState<string>('');

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

  const filteredInvoices = invoices.filter(invoice =>
    invoice.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.dueDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.amount.toLowerCase().includes(searchQuery.toLowerCase())
  ).map(invoice => ({ ...invoice, searchQuery }));

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

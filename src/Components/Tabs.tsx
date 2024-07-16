import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons';
import './Tabs.css';

interface TabsProps {
  view: string;
  setView: (view: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ view, setView, activeTab, setActiveTab }) => {
  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    setView(tab);
  };

  return (
    <div className="tabs-container">
      <div className="tabs">
        <div
          className={`tab ${activeTab === 'inbox' ? 'active' : ''}`}
          onClick={() => handleSetActiveTab('inbox')}
        >
          Inbox
        </div>
        <div
          className={`tab ${activeTab === 'processed' ? 'active' : ''}`}
          onClick={() => handleSetActiveTab('processed')}
        >
          Processed
        </div>
      </div>
      <div className="toggle-buttons">
        <button className={`toggle-button ${view === 'card' ? 'active' : ''}`} onClick={() => setView('card')}>
          <FontAwesomeIcon icon={faTableCellsLarge} />
        </button>
        <button className={`toggle-button ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
    </div>
  );
};

export default Tabs;

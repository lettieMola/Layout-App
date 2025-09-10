import BottomNavigation from '../BottomNavigation';
import { useState } from 'react';

export default function BottomNavigationExample() {
  const [activeTab, setActiveTab] = useState('layouts');

  const handleTabChange = (tab: string) => {
    console.log('Tab changed to:', tab);
    setActiveTab(tab);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        imageCount={3}
      />
    </div>
  );
}
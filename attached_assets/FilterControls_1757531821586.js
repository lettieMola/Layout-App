import React from 'react';

const FilterControls = ({ onFilterSelect }) => {
  const filterOptions = [
    { id: 'filter-1', name: 'Original', type: 'normal', value: 0 },
    { id: 'filter-2', name: 'Clarendon', type: 'filter', value: 1 },
    { id: 'filter-3', name: 'Gingham', type: 'filter', value: 2 },
    { id: 'filter-4', name: 'Moon', type: 'filter', value: 3 },
    { id: 'filter-5', name: 'Lark', type: 'filter', value: 4 },
    { id: 'filter-6', name: 'Reyes', type: 'filter', value: 5 },
    { id: 'filter-7', name: 'Juno', type: 'filter', value: 6 },
    { id: 'filter-8', name: 'Slumber', type: 'filter', value: 7 },
    { id: 'filter-9', name: 'Crema', type: 'filter', value: 8 },
    { id: 'filter-10', name: 'Ludwig', type: 'filter', value: 9 },
  ];

  return (
    <div className="filter-controls">
      <h3>Filters</h3>
      <div className="filter-grid">
        {filterOptions.map(filter => (
          <div 
            key={filter.id} 
            className="filter-item"
            onClick={() => onFilterSelect(filter)}
          >
            <div className={`filter-preview ${filter.name.toLowerCase()}`}></div>
            <span>{filter.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterControls;
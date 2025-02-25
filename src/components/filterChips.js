const FilterChips = ({ filters, onClear }) => (
    <div className="filter-chips">
      {Object.entries(filters).map(([key, value]) => (
        value && (
          <div key={key} className="chip">
            <span>{key}: {value.toString()}</span>
            <button onClick={() => onClear(key)}>×</button>
          </div>
        )
      ))}
      <button className="clear-all" onClick={() => onClear()}>
        Clear All
      </button>
    </div>
  );
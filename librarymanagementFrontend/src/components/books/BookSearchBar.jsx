import React from "react";

export default function BookSearchBar({ query, onQueryChange, onSearch, onClear }) {
  return (
    <div className="toolbar">
      <input
        className="search-input"
        placeholder="Search by title, author, or ISBN"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <button className="btn btn-secondary" onClick={onSearch}>Search</button>
      {query && (
        <button className="btn btn-secondary" onClick={onClear}>Clear</button>
      )}
    </div>
  );
}

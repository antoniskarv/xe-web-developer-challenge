import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialSelected = {
    mainText: "",
    placeId: ""
};

function AutocompleteInput({ onSelect }) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedArea, setSelectedArea] = useState(initialSelected);
    const [isSearching, setIsSearching] = useState(false); 

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 3) {
                setSuggestions([]);
                return;
            }
            
            if (selectedArea.mainText && query === selectedArea.mainText && !isSearching) {
                 setSuggestions([]);
                 return;
            }

            try {
                setLoading(true);
                setError("");
                const res = await fetch(`${API_BASE_URL}/api/autocomplete?input=${encodeURIComponent(query)}`);
                
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const data = await res.json();
                setSuggestions(data);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Σφάλμα στη φόρτωση προτάσεων");
            } finally {
                setLoading(false);
            }
        };

        const delayDebounce = setTimeout(fetchSuggestions, 400);

        return () => clearTimeout(delayDebounce);
    }, [query, selectedArea.mainText, isSearching]);

    const handleSelect = (s) => {
        setSelectedArea({
            mainText: s.mainText,
            placeId: s.placeId
        });
        
        setQuery(s.mainText); 
        
        setSuggestions([]);
        setIsSearching(false);
        
        onSelect(s); 
    };
    
    const handleFocus = () => {
      setSuggestions([]);
      setIsSearching(true);

      if (selectedArea.placeId) {
        setSelectedArea(initialSelected);
        onSelect(null);
        setQuery("");
      }
    };

    
    const handleChange = (e) => {
        setQuery(e.target.value);
        setIsSearching(true);
    }
    
    const handleBlur = () => {
        setTimeout(() => {
            if (!selectedArea.placeId) {
                 setQuery(""); 
            }
            setSuggestions([]); 
        }, 100); 
    }

    return (
        <div style={{ position: "relative", width: "100%", fontFamily: "sans-serif" }}>
            <div style={{ 
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: selectedArea.placeId && !isSearching ? '0px 0px 0px 15px' : '10px',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'black',
                cursor: 'pointer',
            }}>
                {selectedArea.placeId && !isSearching ? (
                    <span style={{ fontWeight: 'bold' }}>
                        {selectedArea.mainText}
                    </span>
                ) : (
                    <input
                        type="text"
                        name="autocomplete"
                        value={query}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder={selectedArea.placeId ? "Αλλαγή περιοχής..." : "Πληκτρολόγησε περιοχή..."}
                        style={{ 
                            width: "100%", 
                            border: "none", 
                            padding: "0",
                            backgroundColor: 'transparent',
                            outline: 'none',
                            color: 'black'
                        }}
                    />
                )}
                {selectedArea.placeId && !isSearching && (
                     <button
                        onClick={handleFocus}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                    >
                        ✖️
                    </button>
                )}
            </div>

            {loading && 
                <div style={{ padding: "8px", color: "black" }}>
                    Φόρτωση...
                </div>
            }
            {error && <div style={{ color: "red", padding: "8px" }}>{error}</div>}
            {(suggestions.length > 0 && isSearching) && (
                <ul style={{
                    position: "absolute",
                    background: "white",
                    border: "1px solid #ccc",
                    width: "100%",
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    zIndex: 1000,
                    maxHeight: "200px",
                    overflowY: "auto",
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    {suggestions.map((s) => (
                        <li
                            key={s.placeId}
                            onMouseDown={() => handleSelect(s)} 
                            style={{ 
                                padding: "10px", 
                                cursor: "pointer", 
                                color: "#333",
                                borderBottom: '1px solid #eee'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f8ff'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <div style={{ fontWeight: '600' }}>{s.mainText}</div>
                            <small style={{ color: '#666' }}>{s.secondaryText}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AutocompleteInput;

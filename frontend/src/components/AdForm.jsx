import { useState } from "react";
import AutocompleteInput from "./AutocompleteInput.jsx"; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TYPE_OPTIONS = [
    { value: "", label: "Επιλέξτε τύπο αγγελίας", disabled: true },
    { value: "rent", label: "Ενοικίαση" },
    { value: "buy", label: "Αγορά" },
    { value: "exchange", label: "Ανταλλαγή" },
    { value: "donation", label: "Δωρεά" },
];

function AdForm() {
    const [formData, setFormData] = useState({
        title: "",
        type: "",
        area: null, 
        price: "",
        description: "",
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, '');

        setFormData((prev) => ({ ...prev, price: numericValue }));

        if (errors.price) {
            setErrors((prev) => ({ ...prev, price: "" }));
        }
    };

    const isFormValid = () => {
    return (
        formData.title &&
        formData.type &&
        formData.area?.placeId &&
        formData.price &&
        Object.values(errors).every((msg) => msg === "")
    );
};

    const handleAutocompleteInput = (areaObject) => {
    const normalized = (areaObject && areaObject.placeId)
        ? { placeId: areaObject.placeId, mainText: areaObject.mainText }
        : null;

    setFormData((prev) => ({ ...prev, area: normalized }));

    setErrors((prev) => ({
        ...prev,
        area: normalized ? "" : "Πρέπει να επιλέξεις περιοχή από τη λίστα."
    }));
    };

    const validateField = (name, value) => {
        let errorMsg = "";

        switch (name) {
            case "title":
                if (!value || value.length > 255) {
                    errorMsg = "Ο τίτλος της αγγελίας είναι υποχρεωτικός (ως 255 χαρακτήρες).";
                }
                break;

            case "type":
                if (!value) {
                    errorMsg = "Ο τύπος τηε αγγελίας είναι υποχρεωτικός.";
                }
                break;

            case "price":
                if (isNaN(value) || value <= 0) {
                    errorMsg = "Η τιμή του ακινήτου είναι υποχρεωτική και πρέπει να είναι θετικός αριθμός.";
                }
                break;

            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_BASE_URL}/api/ads`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Σφάλμα καταχώρησης αγγελίας:", errorData);
                alert(`❌ Αποτυχία καταχώρησης αγγελίας: ${errorData.error || "Άγνωστο σφάλμα"}`);
                setSubmitted(false);
                return;
            }

            const data = await response.json();
            console.log("✅ Επιτυχής καταχώρησης αγγελίας:", data);
            setSubmitted(true);

            setFormData({
                title: "",
                type: "",
                area: null,
                price: "",
                description: "",
            });

        } catch (err) {
            console.error("Σφάλμα δικτύου:", err);
            alert("❌ Πρόβλημα επικοινωνίας με τον server. Δοκιμάστε ξανά.");
            setSubmitted(false);
        }
    };


    const styles = {
        container: { maxWidth: "600px", margin: "0 auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", backgroundColor: "#f9f9f9" },
        fieldGroup: { marginBottom: "15px" },
        label: { display: "block", marginBottom: "5px", fontWeight: "bold", color: "black" },
        input: { width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box", color: "black", backgroundColor: "white" },
        textarea: { width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box", minHeight: "100px", resize: "vertical", color: "black", backgroundColor: "white" },
        select: { width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box", backgroundColor: "white", color: "black" },
        error: { color: "red", fontSize: "0.9em", marginTop: "5px" },
        submitButton: { padding: "12px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1em", fontWeight: "bold", marginTop: "20px" }
    };

    if (submitted) {
        return (
            <div style={{ ...styles.container, textAlign: 'center', backgroundColor: '#e8f5e9', border: '2px solid #4CAF50' }}>
                <h2 style={{ color: '#4CAF50' }}>✅ Επιτυχής καταχώρησης αγγελίας!</h2>
                <button 
                    onClick={() => setSubmitted(false)} 
                    style={{ ...styles.submitButton, backgroundColor: '#4CAF50' }}
                >
                    Καταχώριση νέας σγγελίας
                </button>
                <p>
                    <a
                        href={`${import.meta.env.VITE_API_BASE_URL}/api/ads`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-block', marginTop: 12, color: '#007bff', textDecoration: 'underline' }}
                        >
                        Δείτε εδώ όλες τις αγγελίες (JSON)
                    </a>
                </p>

            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={styles.container}>

            <div style={styles.fieldGroup}>
                <label htmlFor="title" style={styles.label}>Τίτλος*</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder={"Εισαγωγή τίτλου αγγελίας..."}
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={255}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                    style={styles.input}
                />
                {errors.title && <div style={styles.error}>{errors.title}</div>}
            </div>

            <div style={styles.fieldGroup}>
                <label htmlFor="type" style={styles.label}>Τύπος ακινήτου*</label>
                <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                    style={styles.select}
                >
                    {TYPE_OPTIONS.map(option => (
                        <option 
                            key={option.value} 
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                {errors.type && <div style={styles.error}>{errors.type}</div>}
            </div>

            <div style={styles.fieldGroup}>
                <label style={styles.label}>Περιοχή*</label>
                <AutocompleteInput onSelect={handleAutocompleteInput} />
                {errors.area && <div style={styles.error}>{errors.area}</div>}
            </div>

            <div style={styles.fieldGroup}>
                <label htmlFor="price" style={styles.label}>Τιμή(€)*</label>
                <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handlePriceChange}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                    placeholder="Π.χ. 150000"
                    style={styles.input}
                />
                {errors.price && <div style={styles.error}>{errors.price}</div>}
            </div>

            <div style={styles.fieldGroup}>
                <label htmlFor="description" style={styles.label}>Περιγραφή (Προαιρετικό)</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    style={styles.textarea}
                ></textarea>
            </div>

        <button
        type="submit"
        style={{
            ...styles.submitButton,
            backgroundColor: isFormValid() ? "#33ae52ff" : "#ccc",
            cursor: isFormValid() ? "pointer" : "not-allowed"
        }}
        disabled={!isFormValid()}
        >
        Υποβολή Αγγελίας
        </button>

        </form>
    );
}

export default AdForm;

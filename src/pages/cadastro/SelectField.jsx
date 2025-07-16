function SelectField({ label, name, value, onChange, options, required = false }) {
  return (
    <label>
      {label}
      <select name={name} value={value} onChange={onChange} required={required}>
        <option value="">Selecione</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}

export default SelectField; 
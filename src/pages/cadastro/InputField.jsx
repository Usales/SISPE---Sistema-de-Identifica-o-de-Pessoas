function InputField({ label, type = "text", name, value, onChange, required = false }) {
  return (
    <label>
      {label}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </label>
  );
}

export default InputField; 
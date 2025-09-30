import { useState } from 'react';
import { autoFormatPhoneNumber, autoFormatSSN } from './FormUtils';
import { Input } from "@/components/ui/input";

const FormattedInput = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
  showError = true,
  ...props
}) => {
  const [internalError, setInternalError] = useState(null);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    
    if (type === 'phone') {
      const { value: formattedValue, error: formatError } = autoFormatPhoneNumber(inputValue);
      setInternalError(formatError);
      if (onChange) {
        onChange(formattedValue);
      }
    } else if (type === 'ssn') {
      const { value: formattedValue, error: formatError } = autoFormatSSN(inputValue);
      setInternalError(formatError);
      if (onChange) {
        onChange(formattedValue);
      }
    } else {
      setInternalError(null);
      if (onChange) {
        onChange(inputValue);
      }
    }
  };

  const getInputType = () => {
    if (type === 'phone' || type === 'ssn') {
      return 'tel';
    }
    return type;
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    if (type === 'phone') return '(xxx) xxx-xxxx';
    if (type === 'ssn') return 'xxx-xx-xxxx';
    return '';
  };

  const shouldShowErrorBorder = internalError && !className.includes('border-red');
  const inputClassName = `${className} ${shouldShowErrorBorder ? 'border-red-500' : ''}`;

  return (
    <div className="w-full">
      <Input
        type={getInputType()}
        value={value}
        onChange={handleChange}
        placeholder={getPlaceholder()}
        className={inputClassName}
        disabled={disabled}
        {...props}
      />
      {showError && internalError && (
        <p className="text-red-500 text-xs mt-1">{internalError}</p>
      )}
    </div>
  );
};

export default FormattedInput; 

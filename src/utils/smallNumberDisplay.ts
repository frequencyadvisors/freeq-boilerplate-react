const DISPLAY_PRECISION: number = 14;

const smallNumberDisplay = (number:number|undefined) => {
    if (number === 0 || number === undefined) return '0'; // Handle the edge case for zero
  
    // Convert the number to a fixed-point representation with high precision
    const fixedPointNumber = number.toFixed(20);
  
    const formattedNumber = parseFloat(fixedPointNumber).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 20 });
  
    // Append "..." if the number has more than DISPLAY_PRECISION decimal places
    const decimalIndex = formattedNumber.indexOf('.');
    if (decimalIndex !== -1 && formattedNumber.length - decimalIndex - 1 > DISPLAY_PRECISION) {
      return formattedNumber.slice(0, decimalIndex + (DISPLAY_PRECISION + 1)) + '...';
    }
  
    return formattedNumber;
  }

  export default smallNumberDisplay
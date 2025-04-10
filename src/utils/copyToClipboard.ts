import { ClipboardValueType } from "../types/addressTypes";

const copyToClipboard = ({ value }: { value:ClipboardValueType | string }) => {
    const textToCopy = typeof value === 'string' ? value : (value.hash || value.address || '');
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert(`Address ${textToCopy} copied to clipboard`);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
};

export default copyToClipboard;
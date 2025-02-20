import { toast } from "react-toastify";

export const copyToClipboard = async (data: any) => {

    try {
      
      const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

      await navigator.clipboard.writeText(text);

      toast.success('copied');

    } catch (error) {
      toast.error('failed to copy')
    }
  }
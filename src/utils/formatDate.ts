// @ts-nocheck
import { format } from 'date-fns';
import ptLocale from 'date-fns/locale/pt';

interface FormatDateProps {
    date: Date | number,
    formatString: string,
};

const formatDate = ({ 
    date, formatString 
    } : FormatDateProps) => {
  let dateParam = new Date(date);
  let formattedDate = '';
  if (date !== null && dateParam.toString() !== 'Invalid Date') {
    formattedDate = format(dateParam, formatString, { locale: ptLocale });
  } else {
    formattedDate = formatString.replace(/[a-zA-Z0-9]/g, '-');
  }
  return formattedDate;
};

export default formatDate;

import { lightFormat } from 'date-fns';

export const formatTime = (d: Date) => lightFormat(d, 'HH:mm');

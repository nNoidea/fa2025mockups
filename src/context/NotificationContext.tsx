import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'info' | 'holiday_request';
  read: boolean;
  // Optional fields for specific notification types
  person?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: number) => void;
  deleteNotification: (id: number) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialNotifications: Notification[] = [
  { 
    id: 1, 
    title: 'Ziekte Melding', 
    message: 'Heeft zich ziek gemeld.', 
    time: '10m geleden', 
    type: 'alert', 
    read: false,
    person: 'Sophie De Vries',
    startDate: '04/12/2023 09:00',
    endDate: '06/12/2023 17:00',
    reason: 'Griep'
  },
  { 
    id: 2, 
    title: 'Verlofaanvraag', 
    message: 'Wenst verlof op te nemen.', 
    time: '1u geleden', 
    type: 'holiday_request', 
    read: false,
    person: 'Tom Peeters',
    startDate: '24/12/2023 08:00',
    endDate: '02/01/2024 17:00'
  },
  { id: 3, title: 'Nieuw Rooster', message: 'Het rooster voor volgende week is beschikbaar.', time: '2u geleden', type: 'info', read: false },
  { id: 4, title: 'Onderhoud', message: 'Systeemonderhoud gepland voor vannacht 02:00.', time: '3u geleden', type: 'info', read: false },
  { id: 5, title: 'Team Meeting', message: 'Herinnering: Team meeting morgen om 10:00.', time: '4u geleden', type: 'info', read: false },
  { id: 6, title: 'Beveiligingsupdate', message: 'Nieuwe veiligheidsprotocollen zijn van kracht.', time: '5u geleden', type: 'info', read: false },
  { id: 7, title: 'Verjaardag', message: 'Lisa wordt vandaag 30! Feliciteer haar.', time: '6u geleden', type: 'info', read: false },
  { id: 8, title: 'Kantine', message: 'Het menu voor volgende week staat online.', time: '7u geleden', type: 'info', read: false },
  { id: 9, title: 'Parkeerplaats', message: 'Onderhoud aan parkeerplaats A op maandag.', time: '8u geleden', type: 'info', read: false },
  { id: 10, title: 'HR Mededeling', message: 'Graag uw urenregistratie controleren voor vrijdag.', time: '9u geleden', type: 'info', read: false },
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? ({ ...n, read: true }) : n));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, markRead, deleteNotification, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

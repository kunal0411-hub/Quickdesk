import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Ticket, Comment, Category, User, TicketContextType } from '../types';

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

const initialCategories: Category[] = [
  {
    id: '1',
    name: 'Technical Issue',
    description: 'Hardware or software problems',
    color: '#EF4444',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Account Access',
    description: 'Login and account related issues',
    color: '#3B82F6',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'General Inquiry',
    description: 'General questions and information',
    color: '#10B981',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Feature Request',
    description: 'New feature suggestions',
    color: '#F59E0B',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const initialTickets: Ticket[] = [
  {
    id: '1',
    subject: 'Unable to access my account',
    description: 'I forgot my password and the reset email is not arriving',
    category: '2',
    status: 'open',
    priority: 'high',
    createdBy: '3',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    upvotes: [],
    downvotes: []
  },
  {
    id: '2',
    subject: 'Application crashes on startup',
    description: 'The application crashes immediately when I try to open it. This started happening after the latest update.',
    category: '1',
    status: 'in_progress',
    priority: 'urgent',
    createdBy: '3',
    assignedTo: '2',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    upvotes: ['3'],
    downvotes: []
  }
];

const initialComments: Comment[] = [
  {
    id: '1',
    ticketId: '2',
    userId: '2',
    userName: 'Support Agent',
    userRole: 'support_agent',
    content: 'Thank you for reporting this issue. I\'ve escalated this to our development team and we\'re working on a fix.',
    createdAt: '2024-01-15T09:15:00Z'
  }
];

const initialUsers: User[] = [
  {
    id: '1',
    email: 'admin@quickdesk.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'agent@quickdesk.com',
    name: 'Support Agent',
    role: 'support_agent',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'user@quickdesk.com',
    name: 'End User',
    role: 'end_user',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

interface TicketProviderProps {
  children: ReactNode;
}

export const TicketProvider: React.FC<TicketProviderProps> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const savedTickets = localStorage.getItem('quickdesk_tickets');
    const savedComments = localStorage.getItem('quickdesk_comments');
    const savedCategories = localStorage.getItem('quickdesk_categories');
    const savedUsers = localStorage.getItem('quickdesk_users');

    setTickets(savedTickets ? JSON.parse(savedTickets) : initialTickets);
    setComments(savedComments ? JSON.parse(savedComments) : initialComments);
    setCategories(savedCategories ? JSON.parse(savedCategories) : initialCategories);
    setUsers(savedUsers ? JSON.parse(savedUsers) : initialUsers);
  }, []);

  useEffect(() => {
    localStorage.setItem('quickdesk_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('quickdesk_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('quickdesk_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('quickdesk_users', JSON.stringify(users));
  }, [users]);

  const createTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'downvotes'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: [],
      downvotes: []
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === id 
        ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
        : ticket
    ));
  };

  const addComment = (commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setComments(prev => [...prev, newComment]);
  };

  const createCategory = (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(category => 
      category.id === id ? { ...category, ...updates } : category
    ));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const voteTicket = (ticketId: string, userId: string, type: 'upvote' | 'downvote') => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        const upvotes = ticket.upvotes.filter(id => id !== userId);
        const downvotes = ticket.downvotes.filter(id => id !== userId);
        
        if (type === 'upvote') {
          upvotes.push(userId);
        } else {
          downvotes.push(userId);
        }
        
        return { ...ticket, upvotes, downvotes, updatedAt: new Date().toISOString() };
      }
      return ticket;
    }));
  };

  const value: TicketContextType = {
    tickets,
    comments,
    categories,
    users,
    createTicket,
    updateTicket,
    addComment,
    createCategory,
    updateCategory,
    deleteCategory,
    updateUser,
    deleteUser,
    voteTicket
  };

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
};
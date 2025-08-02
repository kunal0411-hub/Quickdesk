export interface User {
  id: string;
  email: string;
  name: string;
  role: 'end_user' | 'support_agent' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: string;
  categoryName?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  upvotes: string[];
  downvotes: string[];
  attachments?: string[];
}

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userRole: string;
  content: string;
  createdAt: string;
  isInternal?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role?: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export interface TicketContextType {
  tickets: Ticket[];
  comments: Comment[];
  categories: Category[];
  users: User[];
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'downvotes'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  createCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  voteTicket: (ticketId: string, userId: string, type: 'upvote' | 'downvote') => void;
}
import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTickets } from '../../contexts/TicketContext';
import { Plus, Search, Filter, ChevronDown, Clock, CheckCircle, AlertCircle, XCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import TicketForm from '../Tickets/TicketForm';
import TicketDetail from '../Tickets/TicketDetail';

const EndUserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { tickets, categories, voteTicket } = useTickets();
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const userTickets = tickets.filter(ticket => ticket.createdBy === user?.id);

  const filteredAndSortedTickets = useMemo(() => {
    let filtered = userTickets.filter(ticket => {
      const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });

    switch (sortBy) {
      case 'recent':
        return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      case 'votes':
        return filtered.sort((a, b) => (b.upvotes.length - b.downvotes.length) - (a.upvotes.length - a.downvotes.length));
      default:
        return filtered;
    }
  }, [userTickets, searchTerm, statusFilter, categoryFilter, sortBy]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'open': return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'in_progress': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'resolved': return `${baseClasses} bg-green-100 text-green-800`;
      case 'closed': return `${baseClasses} bg-gray-100 text-gray-800`;
      default: return baseClasses;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const baseClasses = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";
    switch (priority) {
      case 'urgent': return `${baseClasses} bg-red-100 text-red-800`;
      case 'high': return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'medium': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low': return `${baseClasses} bg-green-100 text-green-800`;
      default: return baseClasses;
    }
  };

  const handleVote = (ticketId: string, type: 'upvote' | 'downvote') => {
    if (user) {
      voteTicket(ticketId, user.id, type);
    }
  };

  const stats = {
    total: userTickets.length,
    open: userTickets.filter(t => t.status === 'open').length,
    inProgress: userTickets.filter(t => t.status === 'in_progress').length,
    resolved: userTickets.filter(t => t.status === 'resolved').length
  };

  if (selectedTicket) {
    return <TicketDetail ticketId={selectedTicket} onBack={() => setSelectedTicket(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
          <p className="text-gray-600">Track and manage your support requests</p>
        </div>
        <button
          onClick={() => setShowTicketForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open</p>
              <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Recently Updated</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority</option>
              <option value="votes">Most Voted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredAndSortedTickets.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600 mb-4">
              {userTickets.length === 0 
                ? "You haven't created any tickets yet." 
                : "No tickets match your current filters."
              }
            </p>
            {userTickets.length === 0 && (
              <button
                onClick={() => setShowTicketForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Ticket
              </button>
            )}
          </div>
        ) : (
          filteredAndSortedTickets.map(ticket => {
            const category = categories.find(c => c.id === ticket.category);
            return (
              <div key={ticket.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(ticket.status)}
                      <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                      <span className={getStatusBadge(ticket.status)}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <span className={getPriorityBadge(ticket.priority)}>
                        {ticket.priority}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>#{ticket.id}</span>
                      {category && (
                        <span className="inline-flex items-center">
                          <div 
                            className="w-2 h-2 rounded-full mr-1" 
                            style={{ backgroundColor: category.color }}
                          ></div>
                          {category.name}
                        </span>
                      )}
                      <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      <span>Updated {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 ml-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleVote(ticket.id, 'upvote')}
                        className={`p-1 rounded transition-colors ${
                          ticket.upvotes.includes(user?.id || '') 
                            ? 'text-green-600 bg-green-50' 
                            : 'text-gray-400 hover:text-green-600'
                        }`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                      <span className="text-sm text-gray-600">{ticket.upvotes.length}</span>
                      
                      <button
                        onClick={() => handleVote(ticket.id, 'downvote')}
                        className={`p-1 rounded transition-colors ${
                          ticket.downvotes.includes(user?.id || '') 
                            ? 'text-red-600 bg-red-50' 
                            : 'text-gray-400 hover:text-red-600'
                        }`}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                      <span className="text-sm text-gray-600">{ticket.downvotes.length}</span>
                    </div>
                    
                    <button
                      onClick={() => setSelectedTicket(ticket.id)}
                      className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showTicketForm && (
        <TicketForm onClose={() => setShowTicketForm(false)} />
      )}
    </div>
  );
};

export default EndUserDashboard;
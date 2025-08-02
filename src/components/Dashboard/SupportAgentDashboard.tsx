import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTickets } from '../../contexts/TicketContext';
import { Plus, Search, Filter, Clock, CheckCircle, AlertCircle, XCircle, User, ThumbsUp, ThumbsDown } from 'lucide-react';
import TicketForm from '../Tickets/TicketForm';
import TicketDetail from '../Tickets/TicketDetail';

const SupportAgentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { tickets, categories, users } = useTickets();
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'assigned'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const allTickets = activeTab === 'all' ? tickets : tickets.filter(ticket => ticket.assignedTo === user?.id);

  const filteredAndSortedTickets = useMemo(() => {
    let filtered = allTickets.filter(ticket => {
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
      default:
        return filtered;
    }
  }, [allTickets, searchTerm, statusFilter, categoryFilter, sortBy]);

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

  const stats = {
    total: tickets.length,
    assigned: tickets.filter(t => t.assignedTo === user?.id).length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length
  };

  if (selectedTicket) {
    return <TicketDetail ticketId={selectedTicket} onBack={() => setSelectedTicket(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Dashboard</h1>
          <p className="text-gray-600">Manage and resolve customer support tickets</p>
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
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assigned to Me</p>
              <p className="text-2xl font-bold text-gray-900">{stats.assigned}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Tickets</p>
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
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors`}
            >
              All Tickets ({tickets.length})
            </button>
            <button
              onClick={() => setActiveTab('assigned')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assigned'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors`}
            >
              My Tickets ({stats.assigned})
            </button>
          </nav>
        </div>

        {/* Filters and Search */}
        <div className="p-6">
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
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredAndSortedTickets.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600">No tickets match your current filters.</p>
          </div>
        ) : (
          filteredAndSortedTickets.map(ticket => {
            const category = categories.find(c => c.id === ticket.category);
            const creator = users.find(u => u.id === ticket.createdBy);
            const assignee = ticket.assignedTo ? users.find(u => u.id === ticket.assignedTo) : null;
            
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
                      <span>By {creator?.name || 'Unknown'}</span>
                      {assignee && <span>Assigned to {assignee.name}</span>}
                      <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 ml-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ThumbsUp className="h-4 w-4 text-green-600" />
                      <span>{ticket.upvotes.length}</span>
                      <ThumbsDown className="h-4 w-4 text-red-600" />
                      <span>{ticket.downvotes.length}</span>
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

export default SupportAgentDashboard;
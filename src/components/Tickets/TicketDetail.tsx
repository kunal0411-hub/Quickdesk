import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTickets } from '../../contexts/TicketContext';
import { 
  ArrowLeft, Clock, CheckCircle, AlertCircle, XCircle, User, Send, 
  ThumbsUp, ThumbsDown, Edit, Trash2, UserCheck 
} from 'lucide-react';

interface TicketDetailProps {
  ticketId: string;
  onBack: () => void;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticketId, onBack }) => {
  const { user } = useAuth();
  const { tickets, comments, categories, users, updateTicket, addComment, voteTicket } = useTickets();
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const ticket = tickets.find(t => t.id === ticketId);
  const ticketComments = comments.filter(c => c.ticketId === ticketId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const category = categories.find(c => c.id === ticket?.category);
  const creator = users.find(u => u.id === ticket?.createdBy);
  const assignee = ticket?.assignedTo ? users.find(u => u.id === ticket.assignedTo) : null;

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Ticket not found</p>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:text-blue-700">
          Go back
        </button>
      </div>
    );
  }

  const canEdit = user?.role === 'admin' || user?.role === 'support_agent' || ticket.createdBy === user?.id;
  const canComment = user?.role === 'admin' || user?.role === 'support_agent' || ticket.createdBy === user?.id;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'in_progress': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'closed': return <XCircle className="h-5 w-5 text-gray-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'open': return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'in_progress': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'resolved': return `${baseClasses} bg-green-100 text-green-800`;
      case 'closed': return `${baseClasses} bg-gray-100 text-gray-800`;
      default: return baseClasses;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    switch (priority) {
      case 'urgent': return `${baseClasses} bg-red-100 text-red-800`;
      case 'high': return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'medium': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low': return `${baseClasses} bg-green-100 text-green-800`;
      default: return baseClasses;
    }
  };

  const handleStatusChange = (newStatus: string) => {
    updateTicket(ticketId, { status: newStatus as any });
  };

  const handleAssignTicket = () => {
    if (user?.role === 'support_agent' || user?.role === 'admin') {
      updateTicket(ticketId, { assignedTo: user.id });
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmittingComment(true);
    
    try {
      addComment({
        ticketId,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        content: newComment.trim()
      });
      setNewComment('');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleVote = (type: 'upvote' | 'downvote') => {
    if (user) {
      voteTicket(ticketId, user.id, type);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Ticket #{ticket.id}</h1>
          <p className="text-gray-600">Created {new Date(ticket.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Ticket Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              {getStatusIcon(ticket.status)}
              <h2 className="text-xl font-semibold text-gray-900">{ticket.subject}</h2>
              <span className={getStatusBadge(ticket.status)}>
                {ticket.status.replace('_', ' ')}
              </span>
              <span className={getPriorityBadge(ticket.priority)}>
                {ticket.priority}
              </span>
            </div>
            
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              {category && (
                <span className="inline-flex items-center">
                  <div 
                    className="w-2 h-2 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  {category.name}
                </span>
              )}
              <span>Created by {creator?.name || 'Unknown'}</span>
              {assignee && <span>Assigned to {assignee.name}</span>}
              <span>Last updated {new Date(ticket.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="ml-6 space-y-4">
            {/* Voting */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleVote('upvote')}
                className={`p-2 rounded transition-colors ${
                  ticket.upvotes.includes(user?.id || '') 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-400 hover:text-green-600'
                }`}
              >
                <ThumbsUp className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-600">{ticket.upvotes.length}</span>
              
              <button
                onClick={() => handleVote('downvote')}
                className={`p-2 rounded transition-colors ${
                  ticket.downvotes.includes(user?.id || '') 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-400 hover:text-red-600'
                }`}
              >
                <ThumbsDown className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-600">{ticket.downvotes.length}</span>
            </div>

            {/* Actions */}
            {(user?.role === 'support_agent' || user?.role === 'admin') && (
              <div className="space-y-2">
                {!ticket.assignedTo && (
                  <button
                    onClick={handleAssignTicket}
                    className="w-full flex items-center justify-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Assign to Me
                  </button>
                )}
                
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Timeline</h3>
        
        <div className="space-y-6">
          {ticketComments.map((comment, index) => (
            <div key={comment.id} className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">{comment.userName}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    comment.userRole === 'admin' ? 'bg-purple-100 text-purple-800' :
                    comment.userRole === 'support_agent' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {comment.userRole.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Comment Form */}
        {canComment && (
          <form onSubmit={handleSubmitComment} className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmittingComment}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmittingComment ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;
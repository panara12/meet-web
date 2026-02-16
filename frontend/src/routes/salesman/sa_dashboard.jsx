import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import { 
  UserPlus, 
  Plus,
  Calendar,
  IndianRupeeIcon,
  Package,
  Zap,
  Activity,
  Edit3,
  Trash2,
  X
} from 'lucide-react';
import { useGetAllNotes } from '../../hooks/salesman/useGetAllNotes';
import LoadingGif from '../../component/loading';
import ErrorMessage from '../../component/ui/errorMessage';
import { useAddNotes } from '../../hooks/salesman/useAddNotes';
import { useEditNotes } from '../../hooks/salesman/useEditNotes';
import { useDeleteNote } from '../../hooks/salesman/useDeleteNote';
import { div } from 'framer-motion/client';


// Modal Component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    );
  };

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [canAddNotes,setCanAddNotes] = useState(true);
  const [quickNotes, setQuickNotes] = useState([]);
  const { data: getAllNotes, isPending:isgetallnotesPending, isError:isgetallnotesError, error: getallnotesError } = useGetAllNotes();
  const {mutate:addNotes,isPending:isAddNotePending,isError:isAddNoteError,error:addNoteError} = useAddNotes();
  const {mutate:editNotes,isPending:isEditNotePending,isError:isEditNoteError,error:editNoteError} = useEditNotes();
  const {mutate:deleteNotes,isPending:isDeleteNotePending,isError:isDeleteNoteError,error:deleteNoteError} = useDeleteNote();

  useEffect(()=>{
    // console.log(getAllNotes);
    if (getAllNotes && Array.isArray(getAllNotes.notes)) {
      setQuickNotes(getAllNotes.notes);
      if(quickNotes.length == 9){
        setCanAddNotes(false);
      }else{
        setCanAddNotes(true);
      }
    }
  },[getAllNotes])

  const [newNote, setNewNote] = useState({
    type: 'note',
    title: '',
    content: '',
    color: 'blue',
    priority: 'medium'
  });

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      green: 'bg-green-50 border-green-200 text-green-900',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      purple: 'bg-purple-50 border-purple-200 text-purple-900',
      red: 'bg-red-50 border-red-200 text-red-900'
    };
    return colorMap[color] || colorMap.blue;
  };

  useEffect(()=>{
    if (!isAddingNote) return;

    // Reset note only once when modal opens
    setNewNote({
      type: 'note',
      title: '',
      content: '',
      color: 'blue',
      priority: 'medium',
    });
  },[isAddingNote])

  const handleAddNote = () => {
      addNotes(newNote);
      setIsAddingNote(false);
  };

  const handleUpdateNote = () => {
    if (editingNote && editingNote.title.trim() && editingNote.content.trim()) {
      // console.log(editingNote)
        editNotes(editingNote)
      setEditingNote(null);
    }
  };

  const handleDeleteNote = (id) => {
    deleteNotes(id)
  };

  

  // Select Component
  const Select = ({ value, onValueChange, children, placeholder }) => {
    return (
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3986] focus:border-transparent outline-none"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
    );
  };

  const SelectItem = ({ value, children }) => {
    return <option value={value}>{children}</option>;
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 mb-4 sm:mb-0">Here's an overview of your sales performance.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link  
            to={"/salesman/addclient"}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1E3986] text-white rounded-lg hover:bg-[#162d73] transition-colors font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Add Client
          </Link>
          <Link 
            to={'/salesman/addorder'}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-[#1E3986] text-[#1E3986] rounded-lg hover:bg-[#1E3986] hover:text-white transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Order
          </Link>
        </div>
      </div>

      {/* Current Period */}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        <span>Current Period: September 2025</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Sales Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Sales</h3>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <IndianRupeeIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900"><IndianRupeeIcon className='w-5 h-5 inline-block mr-1' />{getAllNotes?.totals?.totalAmount.toFixed(2)}</div>
            <div className="flex items-center gap-1">
              {/* <span className="text-green-600 font-medium">+0%</span>
              <span className="text-sm text-gray-600">from last month</span> */}
            </div>
            <div className="text-xs text-gray-500">Resets on 1st of each month</div>
          </div>
        </div>

        {/* Monthly Orders Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Orders</h3>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">{getAllNotes?.totals?.orderCount}</div>
            <div className="flex items-center gap-1">
              {/* <span className="text-blue-600 font-medium">+0%</span>
              <span className="text-sm text-gray-600">from last month</span> */}
            </div>
            <div className="text-xs text-gray-500">Resets on 1st of each month</div>
          </div>
        </div>
      </div>

      {/* Quick Notes Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#1E3986]" />
            <h3 className="text-lg font-semibold text-gray-900">Quick Notes</h3>
          </div>
          <button 
            onClick={() => setIsAddingNote(true)}
            className="flex items-center gap-1 text-sm font-medium text-[#1E3986] hover:text-[#fff] transition-colors bg-[#1E3986] hover:bg-[#162d73] text-white px-3 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {isgetallnotesPending ? (<LoadingGif />) 
            : isgetallnotesError ? (<ErrorMessage message={"there is error"}/>)
            : quickNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No notes yet</p>
              <p className="text-xs">Click the + button to add your first note</p>
            </div>
          ) : (
            quickNotes.map((note) => (
              <div key={note._id} className={`p-3 sm:p-4 rounded-lg border ${getColorClasses(note.color)} group relative`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-1 capitalize">{note.title || note.type}</p>
                    <p className="text-sm">
                      <span className="font-medium capitalize">{note.type}:</span> 
                      <span className="ml-1">{note.content}</span>
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      className="h-6 w-6 p-0 text-gray-600 hover:text-[#1E3986] transition-colors"
                      onClick={() => setEditingNote(note)}
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                    <button 
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 transition-colors"
                      onClick={() => handleDeleteNote(note._id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        }
        </div>
      </div>

      {/* Add Note Modal */}
      {canAddNotes ?
      <Modal
        isOpen={isAddingNote}
        onClose={() => setIsAddingNote(false)}
        title="Add New Note"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <Select value={newNote.type} onValueChange={(value) => setNewNote({...newNote, type: value})}>
              <SelectItem value="target">Target</SelectItem>
              <SelectItem value="follow-up">Follow-up</SelectItem>
              <SelectItem value="reminder">Reminder</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="note">Note</SelectItem>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote({...newNote, title: e.target.value})}
              placeholder="Enter note title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3986] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote({...newNote, content: e.target.value})}
              placeholder="Enter note content"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3986] focus:border-transparent outline-none resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <Select value={newNote.color} onValueChange={(value) => setNewNote({...newNote, color: value})}>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="red">Red</SelectItem>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <Select value={newNote.priority} onValueChange={(value) => setNewNote({...newNote, priority: value})}>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </Select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <button 
              onClick={handleAddNote}
              className="flex-1 bg-[#1E3986] text-white px-4 py-2 rounded-lg hover:bg-[#162d73] transition-colors font-medium"
            >
              Add Note
            </button>
            <button 
              onClick={() => setIsAddingNote(false)}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal> 
      : (<Modal 
        isOpen={isAddingNote}
        onClose={() => setIsAddingNote(false)}
        title="Please delete One note to Add"
      >
        <p>
          To add more notes Please delete one Note.
        </p>
      </Modal>)}
      

      {/* Edit Note Modal */}
      <Modal
        isOpen={!!editingNote}
        onClose={() => setEditingNote(null)}
        title="Edit Note"
      >
        {editingNote && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <Select value={editingNote.type} onValueChange={(value) => setEditingNote({...editingNote, type: value})}>
                <SelectItem value="target">Target</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="note">Note</SelectItem>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={editingNote.title}
                onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
                placeholder="Enter note title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3986] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={editingNote.content}
                onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                placeholder="Enter note content"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3986] focus:border-transparent outline-none resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <Select value={editingNote.color} onValueChange={(value) => setEditingNote(prev => ({...prev, color: value}))}>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <Select value={editingNote.priority} onValueChange={(value) => setEditingNote(prev => ({...prev, priority: value}))}>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </Select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <button 
                onClick={handleUpdateNote}
                className="flex-1 bg-[#1E3986] text-white px-4 py-2 rounded-lg hover:bg-[#162d73] transition-colors font-medium"
              >
                Update Note
              </button>
              <button 
                onClick={() => setEditingNote(null)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
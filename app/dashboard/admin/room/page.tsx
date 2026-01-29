"use client";

import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import RoomModel from '../../../components/room/roommodel';
import RoomUpdateModel from '../../../components/room/roomupdatemodel';
import AdminReceptionistLayout from '@/app/components/layout/AdminReceptionistLayout';

// room interface
interface Room {
  id: string;
  roomNumber: string;
  bedType: string;
  floor: string;
  facilities: string[];
  status: 'Available' | 'Booked' | 'Reserved' | 'Waitlist' | 'Blocked';
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'available' | 'booked'>('all');
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const itemsPerPage = 8;

  // Mock data
  const mockRooms: Room[] = [
    {
      id: '1',
      roomNumber: '#001',
      bedType: 'Double bed',
      floor: 'Floor - 1',
      facilities: ['AC', 'Shower', 'Double bed', 'Towel', 'Bathtub', 'TV'],
      status: 'Available'
    },
    {
      id: '2',
      roomNumber: '#002',
      bedType: 'Single bed',
      floor: 'Floor - 2',
      facilities: ['AC', 'Shower', 'Single bed', 'Towel', 'Bathtub', 'TV'],
      status: 'Booked'
    },
    {
      id: '3',
      roomNumber: '#003',
      bedType: 'VIP',
      floor: 'Floor - 1',
      facilities: ['AC', 'Shower', 'Double bed', 'Towel', 'Bathtub', 'TV'],
      status: 'Booked'
    },
    {
      id: '4',
      roomNumber: '#004',
      bedType: 'VIP',
      floor: 'Floor - 1',
      facilities: ['AC', 'Shower', 'Double bed', 'Towel', 'Bathtub', 'TV'],
      status: 'Reserved'
    },
    {
      id: '5',
      roomNumber: '#005',
      bedType: 'Single bed',
      floor: 'Floor - 1',
      facilities: ['AC', 'Shower', 'Double bed', 'Towel', 'Bathtub', 'TV'],
      status: 'Reserved'
    },
    {
      id: '6',
      roomNumber: '#006',
      bedType: 'Double bed',
      floor: 'Floor - 2',
      facilities: ['AC', 'Shower', 'Double bed', 'Towel', 'Bathtub', 'TV'],
      status: 'Waitlist'
    },
    {
      id: '7',
      roomNumber: '#007',
      bedType: 'Double bed',
      floor: 'Floor - 3',
      facilities: ['AC', 'Shower', 'Double bed', 'Towel', 'Bathtub', 'TV'],
      status: 'Reserved'
    },
    {
      id: '8',
      roomNumber: '#008',
      bedType: 'Single bed',
      floor: 'Floor - 5',
      facilities: ['AC', 'Shower', 'Double bed', 'Towel', 'Bathtub', 'TV'],
      status: 'Blocked'
    },
    // Add more rooms for pagination testing
    ...Array.from({ length: 12 }, (_, i) => ({
      id: `${i + 9}`,
      roomNumber: `#${String(i + 9).padStart(3, '0')}`,
      bedType: i % 3 === 0 ? 'Double bed' : i % 3 === 1 ? 'Single bed' : 'VIP',
      floor: `Floor - ${Math.floor(i / 3) + 1}`,
      facilities: ['AC', 'Shower', 'Double bed', 'Towel', 'Bathtub', 'TV'],
      status: ['Available', 'Booked', 'Reserved', 'Waitlist', 'Blocked'][i % 5] as any
    }))
  ];

  // Calculate stats
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const bookedRooms = rooms.filter(r => r.status === 'Booked').length;

  // Fetch rooms data - temporary Using mock data
  const fetchRooms = async () => {
    setLoading(true);
    
    try {
      // Add Fetch API
      /*
      const response = await fetch('/api/rooms');
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      const data = await response.json();
      setRooms(data);
      setFilteredRooms(data);
      */
      
      // Using mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      setRooms(mockRooms);
      setFilteredRooms(mockRooms);
      
    } catch (error) {
      console.error('Error fetching rooms:', error);
      // temporary mock data as fallback
      setRooms(mockRooms);
      setFilteredRooms(mockRooms);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Filter rooms based on active tab
  useEffect(() => {
    let filtered = rooms;
    if (activeTab === 'available') {
      filtered = rooms.filter(r => r.status === 'Available');
    } else if (activeTab === 'booked') {
      filtered = rooms.filter(r => r.status === 'Booked');
    }
    setFilteredRooms(filtered);
    setCurrentPage(1);
  }, [activeTab, rooms]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRooms = filteredRooms.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'text-green-600';
      case 'Booked':
        return 'text-blue-600';
      case 'Reserved':
        return 'text-yellow-600';
      case 'Waitlist':
        return 'text-orange-600';
      case 'Blocked':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Handle adding a new room - simplified Just updates local state
  const handleAddRoom = (roomData: any) => {
    // Convert the roomData from RoomModel to match our Room interface
    const newRoom: Room = {
      id: roomData.id || String(rooms.length + 1),
      roomNumber: `#${roomData.roomNumber}`,
      bedType: `${roomData.bedType} bed`,
      floor: `Floor - ${roomData.floor}`,
      facilities: roomData.facilities || ['AC', 'Shower', 'Double bed', 'Towel', 'Bathtub', 'TV'],
      status: roomData.status || 'Available',
    };
    
    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    
    if (activeTab === 'all') {
      setFilteredRooms(updatedRooms);
    } else if (activeTab === 'available') {
      setFilteredRooms(updatedRooms.filter(r => r.status === 'Available'));
    } else if (activeTab === 'booked') {
      setFilteredRooms(updatedRooms.filter(r => r.status === 'Booked'));
    }
  };

  // Handle room update - simplified Just updates local state
  const handleUpdateRoom = (roomId: string, updatedData: Partial<Room>) => {
    // Update the room in the state
    const updatedRooms = rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          ...updatedData
        };
      }
      return room;
    });
    
    setRooms(updatedRooms);
    
    if (activeTab === 'all') {
      setFilteredRooms(updatedRooms);
    } else if (activeTab === 'available') {
      setFilteredRooms(updatedRooms.filter(r => r.status === 'Available'));
    } else if (activeTab === 'booked') {
      setFilteredRooms(updatedRooms.filter(r => r.status === 'Booked'));
    }
    
    setIsUpdateModalOpen(false);
    setSelectedRoom(null);
    setOpenMenu(null);
  };

  // Handle room delete
  const handleDeleteRoom = async (room: Room) => {
    if (!confirm(`Are you sure you want to delete room ${room.roomNumber}?`)) {
      return;
    }
    
    try {
      // Add delete API
      /*
      const response = await fetch(`/api/rooms/${room.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete room');
      }
      */
      
      const updatedRooms = rooms.filter(r => r.id !== room.id);
      setRooms(updatedRooms);
      
      if (activeTab === 'all') {
        setFilteredRooms(updatedRooms);
      } else if (activeTab === 'available') {
        setFilteredRooms(updatedRooms.filter(r => r.status === 'Available'));
      } else if (activeTab === 'booked') {
        setFilteredRooms(updatedRooms.filter(r => r.status === 'Booked'));
      }
      
      setOpenMenu(null);
      
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Failed to delete room. Please try again.');
    }
  };

  const handleTabChange = (tab: 'all' | 'available' | 'booked') => {
    setActiveTab(tab);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenu(null);
    };

    if (openMenu !== null) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenu]);

  // Open update modal for a specific room
  const handleUpdateClick = (room: Room) => {
    setSelectedRoom(room);
    setIsUpdateModalOpen(true);
    setOpenMenu(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AdminReceptionistLayout role="admin">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with Filters and Add Room Button */}
          <div className="mb-8 flex justify-between items-center">
            {/* Filters */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => handleTabChange('all')}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeTab === 'all'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                All rooms({totalRooms})
              </button>
              <button
                onClick={() => handleTabChange('available')}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeTab === 'available'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Available room({availableRooms})
              </button>
              <button
                onClick={() => handleTabChange('booked')}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeTab === 'booked'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Booked({bookedRooms})
              </button>
            </div>

            {/* Add Room Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Add room</span>
            </button>
          </div>

          {/* Rooms Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-100">
              <div className="col-span-2">
                <span className="text-sm font-medium text-gray-700">Room number</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm font-medium text-gray-700">Bed type</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm font-medium text-gray-700">Room floor</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm font-medium text-gray-700">Room facility</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm font-medium text-gray-700">Status</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm font-medium text-gray-700">Actions</span>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {currentRooms.map((room, index) => (
                <div key={room.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 relative">
                  {/* Room Number */}
                  <div className="col-span-2 flex items-center">
                    <p className="font-medium text-gray-900">{room.roomNumber}</p>
                  </div>

                  {/* Bed Type */}
                  <div className="col-span-2">
                    <p className="font-medium text-gray-900">{room.bedType}</p>
                  </div>

                  {/* Room Floor */}
                  <div className="col-span-2">
                    <p className="font-medium text-gray-900">{room.floor}</p>
                  </div>

                  {/* Room Facilities */}
                  <div className="col-span-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm text-gray-700">AC, shower, Double bed, towel</p>
                      <p className="text-sm text-gray-700">bathtub, TV</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <p className={`text-sm font-medium ${getStatusColor(room.status)}`}>
                      {room.status}
                    </p>
                  </div>

                  {/* Three Dot Menu */}
                  <div className="col-span-2">
                    <div className="relative flex justify-center">
                      <MoreVertical
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === index ? null : index);
                        }}
                        className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700"
                      />

                      {openMenu === index && (
                        <div className="absolute right-0 top-6 w-32 bg-white shadow-lg rounded-md border border-gray-200 z-20">
                          <button
                            className="text-black w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={() => handleUpdateClick(room)}
                          >
                            Update
                          </button>

                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={() => handleDeleteRoom(room)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Show message if no rooms match filter */}
              {currentRooms.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No rooms found for the selected filter.</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm font-medium ${
                      currentPage === pageNum
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Room Model Popup for adding new rooms */}
        <RoomModel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddRoom}
        />

        {/* Room Update Model Popup for update rooms */}
        <RoomUpdateModel
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedRoom(null);
          }}
          onUpdate={handleUpdateRoom}
          roomData={selectedRoom}
        />
      </div>
    </AdminReceptionistLayout>
  );
}
"use client"

import React, { useState, useEffect } from 'react'
import AdminReceptionistLayout from "../../../components/layout/AdminReceptionistLayout";
import RateModel from "../../../components/rate/ratemodel";
import RateUpdateModel from "../../../components/rate/rateupdatemodel";
import { MoreVertical } from 'lucide-react';

interface RateData {
  roomType: string
  cancellationPolicy: string
  rooms: string
  price: string
}

interface RateTableData {
  id: string
  roomType: string
  deals: string
  cancellationPolicy: string
  dealPrice: string
  rate: string
  availability: string | { text: string, isFull: boolean }
}

interface UpdateRateData {
  id: string
  roomType: string
  cancellationPolicy: string
  rooms: string
  price: string
}

export default function RatePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [filterRoomType, setFilterRoomType] = useState('all')
  const [filterDeals, setFilterDeals] = useState('all')
  const [filterPolicy, setFilterPolicy] = useState('all')
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [selectedRate, setSelectedRate] = useState<RateTableData | null>(null)

  // Mock data for the table
  const [tableData, setTableData] = useState<RateTableData[]>([
    { id: '1', roomType: 'Single', deals: 'Family deal', cancellationPolicy: 'Strict', dealPrice: '$ 800', rate: '$ 800', availability: '5 rooms' },
    { id: '2', roomType: 'Double', deals: 'Christmas deal', cancellationPolicy: 'Strict', dealPrice: '$ 1,200', rate: '$ 1,200', availability: { text: 'Full', isFull: true } },
    { id: '3', roomType: 'Triple', deals: 'Family deal', cancellationPolicy: 'Flexible', dealPrice: '$ 2,000', rate: '$ 2,000', availability: '12 rooms' },
    { id: '4', roomType: 'VIP', deals: 'Black Friday', cancellationPolicy: 'Non refundable', dealPrice: '$ 4,000', rate: '$ 4,000', availability: '10 rooms' },
  ])

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

  // Filtered data based on filters
  const filteredData = tableData.filter(item => {
    if (isFilterApplied) {
      if (filterRoomType !== 'all' && item.roomType.toLowerCase() !== filterRoomType) return false
      if (filterDeals !== 'all' && item.deals.toLowerCase() !== filterDeals.replace(' ', '-')) return false
      if (filterPolicy !== 'all' && item.cancellationPolicy.toLowerCase() !== filterPolicy.replace(' ', '-')) return false
    }
    return true
  })

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSaveRate = (formData: RateData) => {
    console.log('Saving rate:', formData)
    
    // Convert form data to table data
    const newRate: RateTableData = {
      id: (tableData.length + 1).toString(),
      roomType: formData.roomType.charAt(0).toUpperCase() + formData.roomType.slice(1),
      deals: formData.roomType === 'single' || formData.roomType === 'triple' ? 'Family deal' : 
             formData.roomType === 'double' ? 'Christmas deal' : 'Black Friday',
      cancellationPolicy: formData.cancellationPolicy.charAt(0).toUpperCase() + formData.cancellationPolicy.slice(1),
      dealPrice: `$ ${formData.price}`,
      rate: `$ ${formData.price}`,
      availability: `${formData.rooms} rooms`
    }
    
    setTableData(prev => [...prev, newRate])
    
    alert(`Rate saved successfully!
Room Type: ${formData.roomType}
Cancellation Policy: ${formData.cancellationPolicy}
Rooms: ${formData.rooms}
Price: $${formData.price}`)
  }

  const handleApplyFilter = () => {
    setIsFilterApplied(true)
  }

  const handleClearFilter = () => {
    setFilterRoomType('all')
    setFilterDeals('all')
    setFilterPolicy('all')
    setIsFilterApplied(false)
  }

  // Handle update rate
  const handleUpdateRate = (rate: RateTableData) => {
    setSelectedRate(rate)
    setIsUpdateModalOpen(true)
    setOpenMenu(null)
  }

  // Handle submit update
  const handleUpdateSubmit = (updatedData: UpdateRateData) => {
    console.log('Updating rate:', updatedData)
    
    // Convert update form data to table data
    const updatedRate: RateTableData = {
      id: updatedData.id,
      roomType: updatedData.roomType.charAt(0).toUpperCase() + updatedData.roomType.slice(1),
      deals: updatedData.roomType === 'single' || updatedData.roomType === 'triple' ? 'Family deal' : 
             updatedData.roomType === 'double' ? 'Christmas deal' : 'Black Friday',
      cancellationPolicy: updatedData.cancellationPolicy.charAt(0).toUpperCase() + updatedData.cancellationPolicy.slice(1),
      dealPrice: `$ ${updatedData.price}`,
      rate: `$ ${updatedData.price}`,
      availability: `${updatedData.rooms} rooms`
    }
    
    setTableData(prev => prev.map(rate => 
      rate.id === updatedData.id ? updatedRate : rate
    ))
    
    setIsUpdateModalOpen(false)
    setSelectedRate(null)
    
    alert(`Rate updated successfully!
Room Type: ${updatedData.roomType}
Cancellation Policy: ${updatedData.cancellationPolicy}
Rooms: ${updatedData.rooms}
Price: $${updatedData.price}`)
  }

  // Handle delete rate
  const handleDeleteRate = (rate: RateTableData) => {
    if (!confirm(`Are you sure you want to delete rate for ${rate.roomType} room?`)) {
      setOpenMenu(null)
      return
    }
    
    console.log('Deleting rate:', rate)
    setTableData(prev => prev.filter(item => item.id !== rate.id))
    setOpenMenu(null)
    
    alert(`Rate for ${rate.roomType} room has been deleted successfully!`)
  }

  const getDealsColor = (deals: string) => {
    switch (deals.toLowerCase()) {
      case 'family deal': return 'bg-blue-100 text-blue-800'
      case 'christmas deal': return 'bg-green-100 text-green-800'
      case 'black friday': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPolicyColor = (policy: string) => {
    switch (policy.toLowerCase()) {
      case 'strict': return 'text-red-600'
      case 'flexible': return 'text-green-600'
      case 'non refundable': return 'text-gray-600'
      default: return 'text-gray-800'
    }
  }

  return (
    <AdminReceptionistLayout role="admin">
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header section */}
        <div className="mb-6">
          <p className="text-gray-600">Rate</p>
        </div>

        {/* Filter and Add Rate Section */}
        <div className="flex items-center justify-between mb-8">
          {/* Filter Section */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              
              {/* Room Type Filter */}
              <select 
                value={filterRoomType}
                onChange={(e) => setFilterRoomType(e.target.value)}
                className="text-black px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All room types</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="triple">Triple</option>
                <option value="vip">VIP</option>
              </select>

              {/* Deals Filter */}
              <select 
                value={filterDeals}
                onChange={(e) => setFilterDeals(e.target.value)}
                className="text-black px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All deals</option>
                <option value="family-deal">Family deal</option>
                <option value="christmas-deal">Christmas deal</option>
                <option value="black-friday">Black Friday</option>
              </select>

              {/* Policy Filter */}
              <select 
                value={filterPolicy}
                onChange={(e) => setFilterPolicy(e.target.value)}
                className="text-black px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All policies</option>
                <option value="strict">Strict</option>
                <option value="flexible">Flexible</option>
                <option value="non-refundable">Non refundable</option>
              </select>

              {/* Apply Filter Button */}
              <button
                onClick={handleApplyFilter}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Apply Filter
              </button>

              {/* Clear Filter Button */}
              {isFilterApplied && (
                <button
                  onClick={handleClearFilter}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          {/* Add Rate Button */}
          <button 
            onClick={handleOpenModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Add rate
          </button>
        </div>

        {/* Table section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="text-sm font-medium text-gray-700">Room type</div>
              <div className="text-sm font-medium text-gray-700">Deals</div>
              <div className="text-sm font-medium text-gray-700">Cancellation policy</div>
              <div className="text-sm font-medium text-gray-700">Deal price</div>
              <div className="text-sm font-medium text-gray-700">Rate</div>
              <div className="text-sm font-medium text-gray-700">Availability</div>
              <div className="text-sm font-medium text-gray-700">Actions</div>
            </div>

            {/* Table Body */}
            {filteredData.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No rates found. {isFilterApplied && "Try changing your filter criteria."}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredData.map((rate, index) => (
                  <div 
                    key={rate.id} 
                    className="grid grid-cols-7 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Room Type */}
                    <div className="text-sm font-medium text-gray-900 flex items-center">
                      {rate.roomType}
                    </div>
                    
                    {/* Deals */}
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getDealsColor(rate.deals)}`}>
                        {rate.deals}
                      </span>
                    </div>
                    
                    {/* Cancellation Policy */}
                    <div className="text-sm font-medium flex items-center">
                      <span className={getPolicyColor(rate.cancellationPolicy)}>
                        {rate.cancellationPolicy}
                      </span>
                    </div>
                    
                    {/* Deal Price */}
                    <div className="text-sm font-bold text-gray-900 flex items-center">
                      {rate.dealPrice}
                    </div>
                    
                    {/* Rate */}
                    <div className="text-sm font-bold text-gray-900 flex items-center">
                      {rate.rate}
                    </div>
                    
                    {/* Availability */}
                    <div className="flex items-center">
                      {typeof rate.availability === 'string' ? (
                        <div className="text-sm text-gray-700">
                          {rate.availability}
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {rate.availability.text}
                        </span>
                      )}
                    </div>
                    
                    {/* Three Dot Menu */}
                    <div className="flex items-center justify-center relative">
                      <MoreVertical
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenu(openMenu === index ? null : index)
                        }}
                        className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700"
                      />

                      {openMenu === index && (
                        <div className="absolute right-6 top-6 w-32 bg-white shadow-lg rounded-md border border-gray-200 z-20">
                          <button
                            className="text-black w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={() => handleUpdateRate(rate)}
                          >
                            Update
                          </button>

                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={() => handleDeleteRate(rate)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Rate Model Modal */}
        <RateModel 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveRate}
        />

        {/* Update Rate Model Modal */}
        {selectedRate && (
          <RateUpdateModel
            isOpen={isUpdateModalOpen}
            onClose={() => {
              setIsUpdateModalOpen(false)
              setSelectedRate(null)
            }}
            rateData={{
              id: selectedRate.id,
              roomType: selectedRate.roomType.toLowerCase(),
              cancellationPolicy: selectedRate.cancellationPolicy.toLowerCase(),
              rooms: typeof selectedRate.availability === 'string' 
                ? selectedRate.availability.replace(' rooms', '') 
                : '0',
              price: selectedRate.rate.replace('$ ', '')
            }}
            onUpdate={handleUpdateSubmit}
          />
        )}
      </div>
    </AdminReceptionistLayout>
  )
}
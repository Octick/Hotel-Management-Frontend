"use client";

import { useState, useEffect } from "react";
import AdminReceptionistLayout from "../../../components/layout/AdminReceptionistLayout";
import DealModel from "../../../components/deal/dealmodel";
import DealUpdateModel from "../../../components/deal/dealupdatemodel";
import { Plus, MoreVertical } from "lucide-react";

// interface for the deal data
interface Deal {
  id: string;
  referenceNumber: string;
  dealName: string;
  reservationsLeft: number;
  endDate: string;
  roomType: string;
  status: 'Ongoing' | 'Full' | 'Inactive' | 'New' | 'Finished';
}

// Interface for new deal form data
interface NewDealData {
  dealName: string;
  referenceNumber: string;
  tags: string[];
  price: string;
  description: string;
  roomType: string[];
  discount: string;
  startDate: string;
  endDate: string;
}

// Interface for update deal form data
interface UpdateDealData {
  id: string;
  referenceNumber: string;
  dealName: string;
  reservationsLeft: number;
  endDate: string;
  roomType: string;
  status: 'Ongoing' | 'Full' | 'Inactive' | 'New' | 'Finished';
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'finished'>('ongoing');
  const [showDealModel, setShowDealModel] = useState(false);
  const [showUpdateDealModel, setShowUpdateDealModel] = useState(false);
  const [ongoingDeals, setOngoingDeals] = useState<Deal[]>([]);
  const [finishedDeals, setFinishedDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchDeals = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Add API endpoint here
      const API = "/api/deals";

       const response = await fetch(API, {
         method: "GET",
         headers: { 'Content-Type': 'application/json' },
       });

      // if (response.ok) {
      //   const allDeals = await response.json();
      //   console.log("Deals fetched successfully", allDeals);
        
      //   // Filter deals based on status
      //   const ongoing = allDeals.filter((deal: Deal) => 
      //     deal.status === 'Ongoing' || deal.status === 'Full' || 
      //     deal.status === 'Inactive' || deal.status === 'New'
      //   );
      //   const finished = allDeals.filter((deal: Deal) => 
      //     deal.status === 'Finished'
      //   );
        
      //   setOngoingDeals(ongoing);
      //   setFinishedDeals(finished);
      // } else {
      //   console.log("Failed to fetch deals");
      //   setError("Failed to fetch deals. Please try again.");
      // }

      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("API would be called:", API);
      
      // mock data
      const mockOngoingDeals: Deal[] = [
        { id: "1", referenceNumber: "#5644", dealName: "Family deal", reservationsLeft: 10, endDate: "21/3/23", roomType: "VIP", status: 'Ongoing' },
        { id: "2", referenceNumber: "#6112", dealName: "Christmas deal", reservationsLeft: 12, endDate: "25/3/23", roomType: "Single, Double", status: 'Full' },
        { id: "3", referenceNumber: "#6141", dealName: "Family deal", reservationsLeft: 15, endDate: "-", roomType: "Triple", status: 'Inactive' },
        { id: "4", referenceNumber: "#6535", dealName: "Black Friday", reservationsLeft: 10, endDate: "1/5/23", roomType: "VIP", status: 'New' },
      ];

      const mockFinishedDeals: Deal[] = [
        { id: "5", referenceNumber: "#6541", dealName: "Summer Special", reservationsLeft: 0, endDate: "15/6/23", roomType: "Double", status: 'Finished' },
        { id: "6", referenceNumber: "#6542", dealName: "Winter Offer", reservationsLeft: 0, endDate: "20/12/23", roomType: "Single", status: 'Finished' },
      ];

      setOngoingDeals(mockOngoingDeals);
      setFinishedDeals(mockFinishedDeals);

    } catch (error) {
      console.error("Failed to fetch deals", error);
      setError("Failed to fetch deals. Please try again.");
      
      // Fallback to mock data on error
      const fallbackOngoingDeals: Deal[] = [
        { id: "1", referenceNumber: "#5644", dealName: "Family deal", reservationsLeft: 10, endDate: "21/3/23", roomType: "VIP", status: 'Ongoing' },
        { id: "2", referenceNumber: "#6112", dealName: "Christmas deal", reservationsLeft: 12, endDate: "25/3/23", roomType: "Single, Double", status: 'Full' },
      ];

      const fallbackFinishedDeals: Deal[] = [
        { id: "3", referenceNumber: "#6541", dealName: "Summer Special", reservationsLeft: 0, endDate: "15/6/23", roomType: "Double", status: 'Finished' },
      ];

      setOngoingDeals(fallbackOngoingDeals);
      setFinishedDeals(fallbackFinishedDeals);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch deals on component mount
  useEffect(() => {
    fetchDeals();
  }, []);

  // Get current deals based on active tab
  const currentDeals = activeTab === 'ongoing' ? ongoingDeals : finishedDeals;

  // Get status color
  const getStatusColor = (status: Deal['status']) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'Full':
        return 'bg-red-100 text-red-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'New':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle add deal button click
  const handleAddDeal = () => {
    setShowDealModel(true);
  };

  // Handle close deal model
  const handleCloseDealModel = () => {
    setShowDealModel(false);
  };

  // Handle save deal
  const handleSaveDeal = (dealData: NewDealData) => {
    console.log('Saving new deal:', dealData);
    alert(`Deal "${dealData.dealName}" saved successfully!`);
    fetchDeals();
  };

  // Handle tab change
  const handleTabChange = (tab: 'ongoing' | 'finished') => {
    setActiveTab(tab);
  };

  // Handle update deal - open update modal
  const handleUpdateDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowUpdateDealModel(true);
    setOpenMenu(null);
  };

  // Handle delete deal
  const handleDeleteDeal = (deal: Deal) => {
    if (!window.confirm(`Are you sure you want to delete deal "${deal.dealName}"?`)) {
      setOpenMenu(null);
      return;
    }
    
    console.log("Delete deal:", deal);
    alert(`Deal "${deal.dealName}" has been deleted (mock action).`);
    
    // Mock delete - update state
    if (activeTab === 'ongoing') {
      setOngoingDeals(prev => prev.filter(d => d.id !== deal.id));
    } else {
      setFinishedDeals(prev => prev.filter(d => d.id !== deal.id));
    }
    
    setOpenMenu(null);
  };


  const handleUpdateSubmit = async (updatedDealData: UpdateDealData) => {
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      //Add API here
      // const API = `/api/deals/${updatedDealData.id}`;
      
      /*
      const response = await fetch(API, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDealData),
      });

      if (response.ok) {
        const updatedDeal = await response.json();
        console.log("Deal updated successfully", updatedDeal);
        
        // Update local state based on active tab
        if (activeTab === 'ongoing') {
          setOngoingDeals(prev => prev.map(deal => 
            deal.id === updatedDealData.id ? updatedDeal : deal
          ));
        } else {
          setFinishedDeals(prev => prev.map(deal => 
            deal.id === updatedDealData.id ? updatedDeal : deal
          ));
        }
        
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update deal");
      }
      */

      // Mock update for now (remove this when Add API endpoint above)
      setTimeout(() => {
        console.log("Mock updating deal:", updatedDealData);
        if (activeTab === 'ongoing') {
          setOngoingDeals(prev => prev.map(deal => 
            deal.id === updatedDealData.id ? updatedDealData : deal
          ));
        } else {
          setFinishedDeals(prev => prev.map(deal => 
            deal.id === updatedDealData.id ? updatedDealData : deal
          ));
        }
        
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      }, 500);

    } catch (error) {
      console.log("Update failed", error);
      setUpdateError(error instanceof Error ? error.message : "Failed to update deal. Please try again.");
      
      setTimeout(() => {
        setUpdateError(null);
      }, 5000);
    } finally {
      setIsUpdating(false);
      setShowUpdateDealModel(false);
    }
  };

  // Handle close update modal
  const handleCloseUpdateDealModel = () => {
    setShowUpdateDealModel(false);
    setSelectedDeal(null);
  };

  return (
    <AdminReceptionistLayout role="admin">
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <p className="text-gray-600">Deal</p>
        </div>

        {/* Success and Error Messages for Update */}
        {updateSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            Deal updated successfully!
          </div>
        )}
        
        {updateError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {updateError}
          </div>
        )}

        {/* Tabs Section with Add Deal Button */}
        <div className="flex items-center justify-between mb-8">
          {/* Circular Tabs */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => handleTabChange('ongoing')}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                activeTab === 'ongoing'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Ongoing
            </button>
            <button
              onClick={() => handleTabChange('finished')}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                activeTab === 'finished'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Finished
            </button>
          </div>

          {/* Add Deal Button */}
          <button
            onClick={handleAddDeal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            Add Deal
          </button>
        </div>

        {/* Loading and Error States */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading deals...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchDeals}
              className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Table Container */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-7 bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="text-sm font-medium text-gray-700">Reference number</div>
                <div className="text-sm font-medium text-gray-700">Deal name</div>
                <div className="text-sm font-medium text-gray-700">Reservations left</div>
                <div className="text-sm font-medium text-gray-700">End date</div>
                <div className="text-sm font-medium text-gray-700">Room type</div>
                <div className="text-sm font-medium text-gray-700">Status</div>
                <div className="text-sm font-medium text-gray-700">Actions</div>
              </div>

              {/* Table Body */}
              {currentDeals.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  No {activeTab} deals found
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {currentDeals.map((deal, index) => (
                    <div
                      key={deal.id}
                      className="grid grid-cols-7 px-6 py-4 hover:bg-gray-50 transition-colors relative"
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {deal.referenceNumber}
                      </div>
                      <div className="text-sm text-gray-700">{deal.dealName}</div>
                      <div className="text-sm font-medium text-gray-900">
                        {deal.reservationsLeft}
                      </div>
                      <div className="text-sm text-gray-700">{deal.endDate}</div>
                      <div className="text-sm text-gray-700">{deal.roomType}</div>
                      <div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            deal.status
                          )}`}
                        >
                          {deal.status}
                        </span>
                      </div>
                      
                      {/* Three Dot Menu */}
                      <div className="relative">
                        <MoreVertical
                          onClick={() => setOpenMenu(openMenu === index ? null : index)}
                          className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700"
                        />

                        {openMenu === index && (
                          <div className="absolute right-6 top-6 w-32 bg-white shadow-lg rounded-md border border-gray-200 z-20">
                            <button
                              className="text-black w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                              onClick={() => {
                                handleUpdateDeal(deal);
                                setOpenMenu(null);
                              }}
                            >
                              Update
                            </button>

                            <button 
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              onClick={() => handleDeleteDeal(deal)}
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
          </>
        )}

        {/* Add Deal Model Popup */}
        <DealModel
          isOpen={showDealModel}
          onClose={handleCloseDealModel}
          onSave={handleSaveDeal}
        />

        {/* Update Deal Model Popup */}
        <DealUpdateModel
          isOpen={showUpdateDealModel}
          onClose={handleCloseUpdateDealModel}
          dealData={selectedDeal}
          onUpdate={handleUpdateSubmit}
          isUpdating={isUpdating}
        />
      </div>
    </AdminReceptionistLayout>
  );
}
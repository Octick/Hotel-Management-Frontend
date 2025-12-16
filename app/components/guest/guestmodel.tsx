import React from 'react';
import { X, User, Hash, Calendar, Bed, Moon, DollarSign, CreditCard, Tag, CheckCircle } from 'lucide-react';

interface GuestModelProps {
  isOpen: boolean;
  onClose: () => void;
  guestData: {
    name: string;
    registrationNumber: string;
    checkInDate: string;
    roomType: string;
    stay: string;
    discount: number;
    roomNumber?: string;
    totalAmount?: number;
    amountPaid?: number;
    status?: 'Clean' | 'Dirty' | 'Inspected' | 'Pick up';
  };
}

export default function GuestModel({ isOpen, onClose, guestData }: GuestModelProps) {
  if (!isOpen || !guestData) return null;

  const getStatusInfo = (status?: string) => {
    switch (status) {
      case 'Clean':
        return {
          color: 'bg-green-100 text-green-800',
          icon: '✓'
        };
      case 'Dirty':
        return {
          color: 'bg-red-100 text-red-800',
          icon: '⚠'
        };
      case 'Inspected':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: '👁'
        };
      case 'Pick up':
        return {
          color: 'bg-purple-100 text-purple-800',
          icon: '📦'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: '•'
        };
    }
  };

  const statusInfo = getStatusInfo(guestData.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-200 rounded-t-xl p-6 relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Guest Details</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors group"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-white group-hover:rotate-90 transition-transform" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Guest Information Card */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 p-5 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{guestData.name}</h3>
                <p className="text-gray-500 text-sm">Primary Guest</p>
              </div>
              {guestData.status && (
                <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.color} flex items-center gap-1.5`}>
                  <span className="text-xs">{statusInfo.icon}</span>
                  <span>{guestData.status}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Hash className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Registration</p>
                  <p className="font-medium text-gray-800">{guestData.registrationNumber}</p>
                </div>
              </div>

              {guestData.roomNumber && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Bed className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Room Number</p>
                    <p className="font-medium text-gray-800">{guestData.roomNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Check-in Date */}
            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Date</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">{guestData.checkInDate}</p>
            </div>

            {/* Room Type */}
            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Bed className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Room Type</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">{guestData.roomType}</p>
            </div>

            {/* Stay Duration */}
            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Stay Duration</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">{guestData.stay}</p>
            </div>

            {/* Discount */}
            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">
                ${guestData.discount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Financial Information */}
          {(guestData.totalAmount !== undefined || guestData.amountPaid !== undefined) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Financial Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Total Amount */}
                {guestData.totalAmount !== undefined && (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">Total Amount</span>
                      </div>
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-xl font-bold text-blue-800">
                      ${guestData.totalAmount.toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Amount Paid */}
                {guestData.amountPaid !== undefined && (
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-medium text-green-600 uppercase tracking-wider">Amount Paid</span>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-xl font-bold text-green-800">
                      ${guestData.amountPaid.toLocaleString()}
                    </p>
                    {/* Show balance if both amounts are available */}
                    {guestData.totalAmount !== undefined && (
                      <div className="mt-2 pt-2 border-t border-green-200">
                        <p className="text-xs text-green-700">
                          Balance: ${(guestData.totalAmount - guestData.amountPaid).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
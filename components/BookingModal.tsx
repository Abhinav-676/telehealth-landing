"use client";

import { useState, useEffect } from "react";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
    const [isMounting, setIsMounting] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [bookingStatus, setBookingStatus] = useState<"idle" | "searching" | "success">("idle");

    useEffect(() => {
        if (isOpen) {
            setIsMounting(true);
            // Small timeout to allow display:block to apply before opacity transition
            const timer = setTimeout(() => setIsAnimating(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => {
                setIsMounting(false);
                setBookingStatus("idle"); // Reset status on close
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSubmit = () => {
        setBookingStatus("searching");

        // Simulate API call
        setTimeout(() => {
            setBookingStatus("success");

            setTimeout(() => {
                onClose();
            }, 1000);
        }, 1500);
    };

    if (!isMounting) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="fixed inset-0 z-10 overflow-y-auto pointer-events-none">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0 pointer-events-auto">
                    {/* Modal Panel */}
                    <div
                        className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all duration-300 sm:my-8 sm:w-full sm:max-w-lg ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    >
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <i className="fa-solid fa-calendar-check text-brand-600"></i>
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                    <h3 className="text-xl font-semibold leading-6 text-gray-900" id="modal-title">Book Consultation</h3>
                                    <div className="mt-4 space-y-4">
                                        <p className="text-sm text-gray-500">Select your specialty to find available doctors.</p>

                                        <div>
                                            <label htmlFor="specialty" className="block text-sm font-medium leading-6 text-gray-900">Specialty</label>
                                            <select id="specialty" className="mt-1 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6">
                                                <option>General Practice</option>
                                                <option>Cardiology</option>
                                                <option>Dermatology</option>
                                                <option>Pediatrics</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">Preferred Date</label>
                                            <input type="date" id="date" defaultValue={new Date().toISOString().split('T')[0]} className="mt-1 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto transition duration-300
                  ${bookingStatus === 'idle' ? 'bg-brand-600 hover:bg-brand-500' : ''}
                  ${bookingStatus === 'searching' ? 'bg-brand-600 opacity-75 cursor-not-allowed' : ''}
                  ${bookingStatus === 'success' ? 'bg-green-600 hover:bg-green-500' : ''}
                `}
                                onClick={handleSubmit}
                                disabled={bookingStatus !== 'idle'}
                            >
                                {bookingStatus === 'idle' && "Find Doctors"}
                                {bookingStatus === 'searching' && "Searching..."}
                                {bookingStatus === 'success' && "Success!"}
                            </button>
                            <button
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition"
                                onClick={onClose}
                                disabled={bookingStatus === 'searching'}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

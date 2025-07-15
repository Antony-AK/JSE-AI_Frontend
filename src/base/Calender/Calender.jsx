import React, { useState, useRef, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
} from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { isValid } from 'date-fns';


const Calendar = ({ selectedDate, onDateChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const allDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const yearDropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target)
      ) {
        setShowYearDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  // Close calendar when clicking outside
  useEffect(() => {
    const close = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleDayClick = (day) => {
    onDateChange(day);
    setShowCalendar(false);
  };

  return (
    <div className="relative w-full">
      {/* Input Field */}
      <input
        type="text"
        readOnly
        onClick={() => setShowCalendar(true)}
        value={selectedDate && isValid(selectedDate) ? format(selectedDate, 'yyyy-MM-dd') : ''}
        placeholder="Pick a date"
        className="w-full px-5 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 ring-[#2c6472] text-gray-600 cursor-pointer"
      />

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div
            ref={calendarRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 bg-white border rounded-xl shadow-xl p-4 w-[300px]"
          >
            {/* Header */}
            {/* Header with Month + Year selector */}
            <div className="flex justify-between items-center mb-4">
              {/* Prev Month */}
              <button
                type="button"
                onClick={() =>
                  setCurrentMonth((prev) =>
                    new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                  )
                }
                className="text-xl px-2 text-[#2c6472]"
              >
                ◀
              </button>

              {/* Month and Year Display */}
              <div className="relative flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">
                  {format(currentMonth, 'MMMM')}
                </span>

                {/* Custom Year Dropdown (click toggle) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowYearDropdown((prev) => !prev)}
                    className="text-sm font-medium text-[#2c6472] border border-gray-300 rounded px-2 py-1 bg-white hover:bg-gray-100 focus:outline-none"
                  >
                    {currentMonth.getFullYear()}
                  </button>

                  {showYearDropdown && (
                    <div
                      ref={yearDropdownRef}
                      className="absolute top-10 left-0 z-20 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto w-[80px]"
                    >
                      {Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => new Date().getFullYear() - i ).map((year) => (
                        <div
                          key={year}
                          onClick={() => {
                            setCurrentMonth((prev) => new Date(year, prev.getMonth(), 1));
                            setShowYearDropdown(false); // close dropdown after select
                          }}
                          className={`px-2 py-1 cursor-pointer text-sm text-center hover:bg-[#2c6472] hover:text-white ${currentMonth.getFullYear() === year
                            ? 'bg-[#2c6472]/10 font-semibold'
                            : ''
                            }`}
                        >
                          {year}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Next Month */}
              {/* Next Month */}
              <button
                type="button"
                onClick={() => {
                  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
                  const now = new Date();
                  if (nextMonth <= now) {
                    setCurrentMonth(nextMonth);
                  }
                }}
                disabled={
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1) > new Date()
                }
                className={`text-xl px-2 ${new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1) > new Date()
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-[#2c6472]'
                  }`}
              >
                ▶
              </button>

            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 text-center text-sm text-gray-700 font-medium gap-1">
              {days.map((day, i) => (
                <div key={i} className="text-[#2c6472] font-semibold">
                  {day}
                </div>
              ))}

              {/* Blank offset for first day */}
              {Array(getDay(startOfMonth(currentMonth)))
                .fill(null)
                .map((_, i) => (
                  <div key={`blank-${i}`} />
                ))}

              {/* Calendar days */}
              {allDays.map((day, index) => {
                const isTodayOrBefore = day <= new Date();

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => isTodayOrBefore && handleDayClick(day)}
                    disabled={!isTodayOrBefore}
                    className={`py-1.5 text-sm rounded-lg transition-all w-full
                    ${isSameDay(day, selectedDate)
                        ? 'bg-[#2c6472] text-white font-semibold'
                        : isTodayOrBefore
                          ? 'hover:bg-[#2c6472]/10 text-gray-800'
                          : 'text-gray-400 cursor-not-allowed opacity-50'
                      }`}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}


            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;

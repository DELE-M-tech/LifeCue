import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WEEKDAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

export default function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [jumpMode, setJumpMode] = useState(false);
  const [viewDate, setViewDate] = useState(() => value ? new Date(value + 'T00:00:00') : new Date());
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setJumpMode(false); }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selected = value ? new Date(value + 'T00:00:00') : null;
  const today = new Date();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, muted: true, date: new Date(year, month - 1, daysInPrevMonth - i) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, muted: false, date: new Date(year, month, d) });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const next = cells.length - (firstDay + daysInMonth) + 1;
    cells.push({ day: next, muted: true, date: new Date(year, month + 1, next) });
  }

  const isSameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const pick = (date) => {
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    onChange(iso);
    setOpen(false);
    setJumpMode(false);
  };

  const displayLabel = selected
    ? selected.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    : 'Select a date';

  // Range of years to show: 20 back, 20 forward from current real year
  const currentRealYear = today.getFullYear();
  const yearOptions = [];
  for (let y = currentRealYear - 15; y <= currentRealYear + 25; y++) yearOptions.push(y);

  return (
    <div className="custom-date-picker" ref={ref}>
      <button type="button" className={`custom-date-trigger ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}>
        <Calendar size={17} />
        {displayLabel}
      </button>

      {open && (
        <div className="custom-date-popover">
          {!jumpMode ? (
            <>
              <div className="cdp-header">
                <button type="button" className="cdp-nav-btn" onClick={() => setViewDate(new Date(year, month - 1, 1))}>
                  <ChevronLeft size={16} />
                </button>
                <button type="button" className="cdp-month-label" onClick={() => setJumpMode(true)}>
                  {MONTHS[month]} {year}
                </button>
                <button type="button" className="cdp-nav-btn" onClick={() => setViewDate(new Date(year, month + 1, 1))}>
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="cdp-weekdays">
                {WEEKDAYS.map(w => <div key={w} className="cdp-weekday">{w}</div>)}
              </div>

              <div className="cdp-days">
                {cells.map((c, i) => (
                  <button
                    type="button"
                    key={i}
                    className={`cdp-day ${c.muted ? 'muted' : ''} ${isSameDay(c.date, today) ? 'today' : ''} ${isSameDay(c.date, selected) ? 'selected' : ''}`}
                    onClick={() => pick(c.date)}
                  >
                    {c.day}
                  </button>
                ))}
              </div>

              <div className="cdp-footer">
                <button type="button" className="cdp-today-btn" onClick={() => { setViewDate(today); pick(today); }}>
                  Today
                </button>
              </div>
            </>
          ) : (
            <div className="cdp-jump-view">
              <div>
                <div className="cdp-jump-label">Year</div>
                <div className="cdp-year-scroll">
                  {yearOptions.map(y => (
                    <button
                      type="button"
                      key={y}
                      className={`cdp-year-cell ${y === year ? 'selected' : ''}`}
                      onClick={() => setViewDate(new Date(y, month, 1))}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="cdp-jump-label">Month</div>
                <div className="cdp-month-grid">
                  {MONTHS_SHORT.map((m, i) => (
                    <button
                      type="button"
                      key={m}
                      className={`cdp-month-cell ${i === month ? 'selected' : ''}`}
                      onClick={() => { setViewDate(new Date(year, i, 1)); setJumpMode(false); }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

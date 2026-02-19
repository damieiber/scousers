"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EfemeridesCard } from '@/components/cards/EfemeridesCard';
import { Efemeride } from '@/lib/types';


const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function EfemeridesPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [efemerides, setEfemerides] = useState<Efemeride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${month}-${day}`;

    setLoading(true);
    fetch(`/api/efemerides?date=${dateStr}`)
      .then((r) => r.json())
      .then((data) => {
        setEfemerides(data.efemerides || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading efemerides:', err);
        setLoading(false);
      });
  }, [selectedDate]);

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const isToday = () => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth()
    );
  };

  const handleMonthChange = (value: string) => {
    const newMonthIndex = MONTHS.indexOf(value);
    const newDate = new Date(selectedDate);
    newDate.setMonth(newMonthIndex);
    setSelectedDate(newDate);
  };

  const handleDayChange = (value: string) => {
    const newDay = parseInt(value);
    const newDate = new Date(selectedDate);
    newDate.setDate(newDay);
    setSelectedDate(newDate);
  };

  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="mb-6 border-b border-border pb-4">
        <h1 className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tighter mb-2">
          Efemérides
        </h1>
        <p className="text-muted-foreground font-medium">
          Historia día por día
        </p>
      </div>

      <div className="mb-10 flex flex-col items-center gap-4">
        <div className="inline-flex items-center gap-1 bg-card/80 backdrop-blur-sm rounded-full border border-border p-1.5 shadow-lg hover:shadow-xl transition-all duration-300">
          <button
            onClick={goToPreviousDay}
            className="p-2 rounded-full hover:bg-primary hover:text-white text-muted-foreground transition-all duration-200"
            aria-label="Día anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center px-2 gap-2">
            <Select value={MONTHS[selectedDate.getMonth()]} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[180px] border-0 bg-transparent focus:ring-0 font-black text-lg uppercase tracking-tight text-center justify-center h-auto py-1">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month) => (
                  <SelectItem key={month} value={month} className="font-medium">
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="w-px h-6 bg-border mx-2"></div>

            <Select value={selectedDate.getDate().toString()} onValueChange={handleDayChange}>
              <SelectTrigger className="w-[100px] border-0 bg-transparent focus:ring-0 font-black text-lg text-center justify-center h-auto py-1">
                <SelectValue placeholder="Día" />
              </SelectTrigger>
              <SelectContent>
                {days.map((day) => (
                  <SelectItem key={day} value={day.toString()} className="font-medium">
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            onClick={goToNextDay}
            className="p-2 rounded-full hover:bg-primary hover:text-white text-muted-foreground transition-all duration-200"
            aria-label="Día siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {!isToday() && (
          <button
            onClick={goToToday}
            className="text-xs font-bold text-primary hover:text-primary/80 bg-primary/10 px-4 py-1.5 rounded-full transition-colors uppercase tracking-wider"
          >
            Volver a hoy
          </button>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-6 animate-pulse bg-card h-64">
              <div className="h-full w-full bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && efemerides.length === 0 && (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <p className="text-xl text-muted-foreground font-medium">No hay efemérides registradas para esta fecha.</p>
        </div>
      )}

      {!loading && efemerides.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {efemerides.map((efemeride, index) => (
            <EfemeridesCard key={index} efemeride={efemeride} isToday={isToday()} />
          ))}
        </div>
      )}
    </div>
  );
}

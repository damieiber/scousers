import { MatchPreviewData } from '@/lib/services/types';
import { Calendar, MapPin, User, CloudSun, Sun, CloudRain, Cloud } from 'lucide-react';

interface MatchHeaderProps {
  data: MatchPreviewData;
}

export function MatchHeader({ data }: MatchHeaderProps) {
  const getWeatherIcon = (icon: string) => {
    if (icon === 'sun') return <Sun className="w-5 h-5 text-yellow-500" />;
    if (icon === 'rain') return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (icon === 'cloud') return <Cloud className="w-5 h-5 text-gray-400" />;
    return <CloudSun className="w-5 h-5 text-muted-foreground" />;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full bg-card border border-border rounded-xl overflow-hidden shadow-sm mb-8">
      <div className="bg-black/5 dark:bg-white/5 px-6 py-2 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <span>Liga Profesional</span>
        <span>Próximo Partido</span>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-right">
            <h2 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter leading-none">
              {data.homeTeam}
            </h2>
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1 block">Local</span>
          </div>
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-black shadow-lg shadow-primary/30">
              VS
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter leading-none">
              {data.awayTeam}
            </h2>
             <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1 block">Visitante</span>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="p-2 rounded-full bg-background border border-border text-primary">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Fecha y Hora</span>
              <span className="text-xs font-bold text-foreground capitalize">{formatDate(data.date)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="p-2 rounded-full bg-background border border-border text-primary">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Estadio</span>
              <span className="text-xs font-bold text-foreground">{data.venue}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="p-2 rounded-full bg-background border border-border text-primary">
              <User className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Árbitro</span>
              <span className="text-xs font-bold text-foreground">{data.referee}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="p-2 rounded-full bg-background border border-border text-primary">
              {getWeatherIcon(data.weather.icon)}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Clima</span>
              <span className="text-xs font-bold text-foreground">{data.weather.temp}°C - {data.weather.condition}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

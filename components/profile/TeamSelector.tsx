'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Team } from '@/lib/types';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface TeamSelectorProps {
  teams: Team[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function TeamSelector({
  teams,
  value,
  onChange,
  placeholder,
  disabled = false,
}: TeamSelectorProps) {
  const { t } = useLanguage();
  const [open, setOpen] = React.useState(false);

  const selectedTeam = teams.find((team) => team.id === value);

  const availableTeams = teams.filter(t => t.isAvailable);
  const unavailableTeams = teams.filter(t => !t.isAvailable);

  const displayPlaceholder = placeholder || t.teamSelector.selectTeam;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedTeam ? selectedTeam.key : displayPlaceholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={t.teamSelector.searchTeam} />
          <CommandList>
            <CommandEmpty>{t.teamSelector.noTeamFound}</CommandEmpty>
            <CommandGroup heading={t.teamSelector.available}>
              {value && (
                <CommandItem
                  value="__clear__"
                  onSelect={() => {
                    onChange(null);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      !value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span className="italic text-muted-foreground">{t.teamSelector.noTeam}</span>
                </CommandItem>
              )}
              {availableTeams.map((team) => (
                <CommandItem
                  key={team.id}
                  value={team.key}
                  onSelect={() => {
                    onChange(team.id === value ? null : team.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === team.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {team.key}
                </CommandItem>
              ))}
            </CommandGroup>
            
            {unavailableTeams.length > 0 && (
              <CommandGroup heading={t.teamSelector.comingSoon}>
                {unavailableTeams.map((team) => (
                  <CommandItem
                    key={team.id}
                    value={team.key}
                    disabled
                    className="opacity-50"
                  >
                    <span className="ml-6 text-muted-foreground">
                      {team.key}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

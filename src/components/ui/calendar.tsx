'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('p-3', className)}
            classNames={{
                root: 'w-full',
                months: 'flex flex-col w-full',
                month: 'w-full',
                month_caption: 'flex items-center justify-between mb-4',
                caption_label: 'text-sm font-semibold text-foreground',
                nav: 'flex items-center gap-1',
                button_previous: cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100'
                ),
                button_next: cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100'
                ),
                month_grid: 'w-full table table-fixed border-collapse',
                weekdays: 'table-row',
                weekday: 'table-cell text-muted-foreground font-medium text-[0.75rem] text-center py-2',
                week: 'table-row',
                day: 'table-cell p-0.5 text-center',
                day_button: cn(
                    'h-9 w-9 p-0 font-normal rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-sm inline-flex items-center justify-center',
                    'aria-selected:opacity-100'
                ),
                selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                today: 'bg-accent text-accent-foreground font-semibold',
                outside: 'text-muted-foreground opacity-40',
                disabled: 'text-muted-foreground opacity-50',
                range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                hidden: 'invisible',
                dropdowns: 'flex items-center justify-center gap-2 grow',
                dropdown: 'p-1 bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer hover:bg-accent rounded-md transition-colors',
                dropdown_root: 'relative inline-flex items-center',
                ...classNames,
            }}
            components={{
                Chevron: ({ ...props }) => {
                    if (props.orientation === 'left') return <ChevronLeft className="h-4 w-4" />
                    return <ChevronRight className="h-4 w-4" />
                }
            }}
            {...props}
        />
    );
}
Calendar.displayName = 'Calendar';

export { Calendar };

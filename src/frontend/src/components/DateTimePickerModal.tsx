import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface DateTimePickerModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

export default function DateTimePickerModal({ open, onClose, onConfirm }: DateTimePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [time, setTime] = useState('12:00');

  const handleConfirm = () => {
    const [hours, minutes] = time.split(':').map(Number);
    const finalDate = new Date(selectedDate);
    finalDate.setHours(hours, minutes, 0, 0);

    if (finalDate < new Date()) {
      alert('Please select a future date and time');
      return;
    }

    onConfirm(finalDate);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Select Date</Label>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              className="rounded-md border"
            />
          </div>

          <div>
            <Label htmlFor="time" className="mb-2 block">
              Select Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

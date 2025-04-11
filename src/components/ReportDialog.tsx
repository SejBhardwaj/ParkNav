
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { reportParkingAvailability } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  spotId: string | null;
  spotName: string;
  totalSpots: number;
}

const ReportDialog: React.FC<ReportDialogProps> = ({
  isOpen,
  onClose,
  spotId,
  spotName,
  totalSpots,
}) => {
  const [availableSpots, setAvailableSpots] = useState(Math.floor(totalSpots / 2));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!spotId) return;
    
    setLoading(true);
    try {
      await reportParkingAvailability(spotId, availableSpots);
      toast({
        title: "Report Submitted",
        description: "Thank you for updating the parking availability!",
      });
      onClose();
    } catch (error) {
      console.error('Error reporting availability:', error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Parking Availability</DialogTitle>
          <DialogDescription>
            Help other drivers by reporting how many spots are currently available at {spotName}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="available-spots">Available Spots: {availableSpots}</Label>
            <Slider
              id="available-spots"
              min={0}
              max={totalSpots}
              step={1}
              value={[availableSpots]}
              onValueChange={(value) => setAvailableSpots(value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>{totalSpots}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Input id="notes" placeholder="E.g., Entrance is from the north side" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="bg-parknav-blue hover:bg-blue-600" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;

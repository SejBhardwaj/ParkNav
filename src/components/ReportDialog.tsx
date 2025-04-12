
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
import { Switch } from '@/components/ui/switch';
import { reportParkingAvailability } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Camera, AlertCircle } from 'lucide-react';

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
  const [includePhoto, setIncludePhoto] = useState(false);
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
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 transition-colors duration-300">
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
            <Input 
              id="notes" 
              placeholder="E.g., Entrance is from the north side"
              className="dark:bg-gray-800"
            />
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Include Photo</span>
            </div>
            <Switch 
              checked={includePhoto} 
              onCheckedChange={setIncludePhoto} 
            />
          </div>
          
          {includePhoto && (
            <div className="mt-2 border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center dark:border-gray-700">
              <Camera className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-center text-muted-foreground">
                Tap to take a photo of the parking area
              </p>
            </div>
          )}
          
          <div className="flex items-start gap-2 mt-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm">
            <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-blue-800 dark:text-blue-300">
              Accurate reporting helps everyone. Your contributions make ParkNav better for all users.
            </p>
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

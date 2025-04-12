
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
import { Camera, AlertCircle, Star, Car, AlertTriangle, Check } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(0);
  const [step, setStep] = useState(1);
  const [issues, setIssues] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!spotId) return;
    
    setLoading(true);
    try {
      await reportParkingAvailability(spotId, availableSpots);
      setSuccess(true);
      // Show success step instead of closing immediately
      setStep(3);
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setStep(1);
        setAvailableSpots(Math.floor(totalSpots / 2));
        setNote('');
        setRating(0);
        setIssues([]);
        setIncludePhoto(false);
      }, 2000);
      
      toast({
        title: "Report Submitted",
        description: "Thank you for updating the parking availability!",
      });
    } catch (error) {
      console.error('Error reporting availability:', error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const toggleIssue = (issue: string) => {
    if (issues.includes(issue)) {
      setIssues(issues.filter(i => i !== issue));
    } else {
      setIssues([...issues, issue]);
    }
  };

  // Possible issues that can be reported
  const possibleIssues = [
    "No security guard",
    "Poor lighting",
    "Narrow parking spaces",
    "Difficult entry/exit",
    "Payment system not working"
  ];

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
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
                value={note}
                onChange={(e) => setNote(e.target.value)}
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
        );
        
      case 2:
        return (
          <div className="grid gap-4 py-4">
            <div className="space-y-3">
              <div>
                <Label className="mb-2 block">Rate your experience (Optional)</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      onClick={() => setRating(star)}
                    >
                      <Star className={`h-6 w-6 ${rating >= star ? 'fill-yellow-400' : 'fill-none'}`} />
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2 pt-3">
                <Label className="block">Report Issues (Optional)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {possibleIssues.map((issue) => (
                    <Button
                      key={issue}
                      type="button"
                      variant={issues.includes(issue) ? "default" : "outline"}
                      size="sm"
                      className="justify-start h-auto py-2 text-xs"
                      onClick={() => toggleIssue(issue)}
                    >
                      {issues.includes(issue) ? (
                        <Check className="h-3 w-3 mr-2" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-2" />
                      )}
                      {issue}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-2 mt-2 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md text-sm">
              <Car className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 dark:text-amber-300">
                Your feedback helps improve parking facilities. We share aggregated feedback with facility operators.
              </p>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="py-6 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4"
            >
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </motion.div>
            <h3 className="text-lg font-semibold text-center">Thank You!</h3>
            <p className="text-center text-muted-foreground mt-2">
              Your report has been submitted successfully.
            </p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 transition-colors duration-300">
        {step < 3 && (
          <DialogHeader>
            <DialogTitle>Update Parking Availability</DialogTitle>
            <DialogDescription>
              Help other drivers by reporting how many spots are currently available at {spotName}.
            </DialogDescription>
          </DialogHeader>
        )}
        
        {renderStepContent()}
        
        {step < 3 && (
          <DialogFooter>
            {step === 2 ? (
              <>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  className="bg-parknav-blue hover:bg-blue-600" 
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Report"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  className="bg-parknav-blue hover:bg-blue-600" 
                  onClick={() => setStep(2)}
                >
                  Next
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;

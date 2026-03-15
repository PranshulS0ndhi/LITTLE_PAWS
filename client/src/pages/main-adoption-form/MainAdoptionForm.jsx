import React, { useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainNavbar from '@/components/main-navbar/MainNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

const AdoptionForm = () => {
  const { user } = useSelector(state => state.auth);
  const { petId } = useParams();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      altPhone: '',
      address: '',
      occupation: '',
      workingHours: ''
    },
    livingConditions: {
      residenceType: '',
      ownershipStatus: '',
      hasYard: false,
      yardFenced: false,
      householdMembers: '',
      childrenAges: '',
      landlordContact: '',
      moveFrequency: ''
    },
    petExperience: {
      currentPets: '',
      previousPets: '',
      vetName: '',
      vetContact: '',
      petAllergies: '',
      trainingExperience: ''
    },
    adoptionDetails: {
      reasonToAdopt: '',
      timeWithPet: '',
      exercisePlan: '',
      petExpenses: '',
      vacationPlan: ''
    }
  });

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/user/adopt/${petId}`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast({ title: "Application submitted!", description: "AI is currently reviewing your profile." });
        window.location.href = '/applicationStatus';
      } else {
        toast({ title: "Submission failed", description: response.data.message, variant: "destructive" });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({ title: "Error", description: "Failed to submit application. Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <MainNavbar />
      <div className="max-w-4xl mx-auto p-6 pt-24 pb-12">
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-indigo-900 text-white rounded-t-xl">
            <CardTitle className="text-2xl text-center font-bold">Pet Adoption Application</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b pb-2 text-indigo-900 flex items-center gap-2">
                  <span className="bg-indigo-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Full Name *</Label>
                    <Input required placeholder="John Doe" value={formData.personalInfo.fullName} onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Email *</Label>
                    <Input type="email" required placeholder="john@example.com" value={formData.personalInfo.email} onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Phone *</Label>
                    <Input required placeholder="+1 234 567 890" value={formData.personalInfo.phone} onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Alternative Phone</Label>
                    <Input placeholder="Optional" value={formData.personalInfo.altPhone} onChange={(e) => handleInputChange('personalInfo', 'altPhone', e.target.value)} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-slate-700 font-semibold">Address *</Label>
                    <Input required placeholder="Street address, City, Zip Code" value={formData.personalInfo.address} onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Occupation *</Label>
                    <Input required placeholder="Software Engineer" value={formData.personalInfo.occupation} onChange={(e) => handleInputChange('personalInfo', 'occupation', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Working Hours *</Label>
                    <Input required placeholder="e.g. 9 AM - 5 PM" value={formData.personalInfo.workingHours} onChange={(e) => handleInputChange('personalInfo', 'workingHours', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Living Conditions */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b pb-2 text-indigo-900 flex items-center gap-2">
                   <span className="bg-indigo-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                   Living Conditions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-slate-700 font-semibold">Residence Type *</Label>
                    <RadioGroup required onValueChange={(v) => handleInputChange('livingConditions', 'residenceType', v)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="house" id="house" />
                        <Label htmlFor="house" className="font-normal cursor-pointer">HOUSE</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="apartment" id="apartment" />
                        <Label htmlFor="apartment" className="font-normal cursor-pointer">APARTMENT</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-slate-700 font-semibold">Ownership Status *</Label>
                    <RadioGroup required onValueChange={(v) => handleInputChange('livingConditions', 'ownershipStatus', v)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Own" id="own" />
                        <Label htmlFor="own" className="font-normal cursor-pointer">OWN</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Rent" id="rent" />
                        <Label htmlFor="rent" className="font-normal cursor-pointer">RENT</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex items-center gap-8 md:col-span-2 bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hasYard" onCheckedChange={(c) => handleInputChange('livingConditions', 'hasYard', !!c)} />
                      <Label htmlFor="hasYard" className="cursor-pointer">Has Yard</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="yardFenced" onCheckedChange={(c) => handleInputChange('livingConditions', 'yardFenced', !!c)} />
                      <Label htmlFor="yardFenced" className="cursor-pointer">Yard is Fenced</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Household Members *</Label>
                    <Input required placeholder="Who lives with you?" value={formData.livingConditions.householdMembers} onChange={(e) => handleInputChange('livingConditions', 'householdMembers', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">How often do you move? *</Label>
                    <Input required placeholder="e.g. Rarely, Every 2 years" value={formData.livingConditions.moveFrequency} onChange={(e) => handleInputChange('livingConditions', 'moveFrequency', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Pet Experience */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b pb-2 text-indigo-900 flex items-center gap-2">
                   <span className="bg-indigo-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                   Pet Experience
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2 space-y-2">
                    <Label className="text-slate-700 font-semibold">Current Pets</Label>
                    <Textarea placeholder="Tell us about your current pets (if any)" value={formData.petExperience.currentPets} onChange={(e) => handleInputChange('petExperience', 'currentPets', e.target.value)} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-slate-700 font-semibold">Previous Pet Experience *</Label>
                    <Textarea required placeholder="Describe your history with pets" value={formData.petExperience.previousPets} onChange={(e) => handleInputChange('petExperience', 'previousPets', e.target.value)} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-slate-700 font-semibold">Training Experience *</Label>
                    <Textarea required placeholder="Do you have experience training pets?" value={formData.petExperience.trainingExperience} onChange={(e) => handleInputChange('petExperience', 'trainingExperience', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Adoption Details */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b pb-2 text-indigo-900 flex items-center gap-2">
                   <span className="bg-indigo-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                   Adoption Commitment
                </h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Why do you want to adopt? *</Label>
                    <Textarea required placeholder="Tell us about your motivation" value={formData.adoptionDetails.reasonToAdopt} onChange={(e) => handleInputChange('adoptionDetails', 'reasonToAdopt', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Daily Time Commitment *</Label>
                        <Input required placeholder="Hours per day" value={formData.adoptionDetails.timeWithPet} onChange={(e) => handleInputChange('adoptionDetails', 'timeWithPet', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Monthly Pet Budget *</Label>
                        <Input required placeholder="Estimated budget" value={formData.adoptionDetails.petExpenses} onChange={(e) => handleInputChange('adoptionDetails', 'petExpenses', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Exercise and Play Plan *</Label>
                    <Textarea required placeholder="How will you keep the pet active?" value={formData.adoptionDetails.exercisePlan} onChange={(e) => handleInputChange('adoptionDetails', 'exercisePlan', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Vacation/Travel Plans *</Label>
                    <Textarea required placeholder="Who will care for the pet when you travel?" value={formData.adoptionDetails.vacationPlan} onChange={(e) => handleInputChange('adoptionDetails', 'vacationPlan', e.target.value)} />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-indigo-900 hover:bg-indigo-800 text-lg py-8 rounded-2xl shadow-xl transition-all font-bold">
                Submit Adoption Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdoptionForm;

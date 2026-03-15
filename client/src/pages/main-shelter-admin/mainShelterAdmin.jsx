import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import MainNavbar from '@/components/main-navbar/MainNavbar';
import { Brain, Filter, CheckCircle, XCircle, Clock, User, MessageSquare, Loader2, Inbox, History, Home, Briefcase, Heart, BookOpen, ExternalLink, ShieldQuestion } from 'lucide-react';

const MainShelterAdmin = () => {
    const { user } = useSelector(state => state.auth);
    const [applications, setApplications] = useState([]);
    const [aiMode, setAiMode] = useState('complete');
    const [loading, setLoading] = useState(true);
    const [processingApps, setProcessingApps] = useState({});
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedApp, setSelectedApp] = useState(null);
    const { toast } = useToast();

    // Memoized counts of yet-to-be-reviewed apps
    const pendingAppsCount = useMemo(() => {
        return applications.filter(app => ['ai-reviewed', 'under-manual-review'].includes(app.status)).length;
    }, [applications]);

    const fetchApplications = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/shelterAdmin/applications', { withCredentials: true });
            if (response.data.success) {
                const fetchedApps = response.data.applications;
                
                if (silent) {
                    const newPendingAppsCount = fetchedApps.filter(app => ['ai-reviewed', 'under-manual-review'].includes(app.status)).length;
                    if (newPendingAppsCount > pendingAppsCount) {
                        toast({
                            title: "New Application Received!",
                            description: `You have ${newPendingAppsCount - pendingAppsCount} new request(s) awaiting your review.`,
                            variant: "default"
                        });
                    }
                }
                setApplications(fetchedApps);
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const fetchReviewMode = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/shelterAdmin/review-mode', { withCredentials: true });
            if (response.data.success) {
                setAiMode(response.data.mode);
            }
        } catch (error) {
            console.error("Error fetching review mode:", error);
        }
    };

    useEffect(() => {
        fetchApplications();
        fetchReviewMode();

        const interval = setInterval(() => {
            fetchApplications(true);
        }, 10000);

        return () => clearInterval(interval);
    }, [pendingAppsCount]);

    const handleToggleMode = async () => {
        const newMode = aiMode === 'complete' ? 'partial' : 'complete';
        try {
            const response = await axios.put('http://localhost:5000/api/shelterAdmin/review-mode', { mode: newMode }, { withCredentials: true });
            if (response.data.success) {
                setAiMode(newMode);
                toast({ title: `AI Mode switched to ${newMode}` });
            }
        } catch (error) {
            toast({ title: "Failed to switch mode", variant: "destructive" });
        }
    };

    const handleReview = async (appId, action) => {
        setProcessingApps(prev => ({ ...prev, [appId]: action }));
        const url = action === 'accept' 
            ? `http://localhost:5000/api/shelterAdmin/applications/${appId}`
            : `http://localhost:5000/api/shelterAdmin/applications/reject/${appId}`;
        
        try {
            const response = await axios.put(url, {}, { withCredentials: true });
            if (response.data.success) {
                toast({ 
                    title: `Application ${action === 'accept' ? 'Accepted' : 'Rejected'}`,
                    description: `The applicant has been notified.`,
                    variant: action === 'accept' ? "default" : "destructive"
                });
                
                setApplications(prev => prev.map(app => 
                    app._id === appId ? { ...app, status: action === 'accept' ? 'accepted' : 'rejected' } : app
                ));
                if (selectedApp && selectedApp._id === appId) {
                    setSelectedApp(null);
                }
            }
        } catch (error) {
            toast({ title: `Failed to ${action} application`, variant: "destructive" });
        } finally {
            setProcessingApps(prev => {
                const newState = { ...prev };
                delete newState[appId];
                return newState;
            });
            fetchApplications(true);
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            case 'ai-reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'under-manual-review': return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const filteredApplications = useMemo(() => {
        if (activeTab === 'pending') {
            return applications.filter(app => ['ai-reviewed', 'under-manual-review'].includes(app.status));
        }
        return applications.filter(app => ['accepted', 'rejected'].includes(app.status));
    }, [applications, activeTab]);

    return (
        <div className="min-h-screen bg-slate-50">
            <MainNavbar />
            <div className="max-w-7xl mx-auto p-6 pt-24 pb-12">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Shelter Dashboard</h1>
                        <p className="text-slate-500 mt-1 font-bold italic uppercase text-xs tracking-widest">Managing: {user?.city} Facility</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-slate-100 p-1 rounded-2xl w-full sm:w-auto">
                            <TabsList className="grid grid-cols-2 bg-transparent h-auto p-0">
                                <TabsTrigger value="pending" className="rounded-xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:text-indigo-900 data-[state=active]:shadow-sm font-bold flex items-center gap-2">
                                    <Inbox size={16} />
                                    YET TO BE REVIEWED
                                    {pendingAppsCount > 0 && <span className="bg-indigo-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1 animate-bounce">{pendingAppsCount}</span>}
                                </TabsTrigger>
                                <TabsTrigger value="reviewed" className="rounded-xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-bold flex items-center gap-2">
                                    <History size={16} />
                                    REVIEWED
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="flex items-center space-x-4 bg-indigo-900 p-4 rounded-2xl border border-indigo-700 shadow-xl shadow-indigo-100 w-full sm:w-auto">
                            <div className="flex flex-col items-end mr-2">
                                <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Validation Mode</span>
                                <span className="text-xs text-white font-black leading-tight">{aiMode === 'complete' ? 'FULL AI' : 'SEMI-AUTO'}</span>
                            </div>
                            <Switch 
                                checked={aiMode === 'complete'}
                                onCheckedChange={handleToggleMode}
                                className="data-[state=checked]:bg-white data-[state=checked]:text-indigo-900"
                            />
                            <Brain className={`w-5 h-5 ${aiMode === 'complete' ? 'text-white animate-pulse' : 'text-indigo-400'}`} />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="h-96 bg-slate-200 rounded-3xl"></div>)}
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            {activeTab === 'pending' ? <Inbox className="w-12 h-12 text-slate-300" /> : <History className="w-12 h-12 text-slate-300" />}
                        </div>
                        <h2 className="text-2xl font-black text-slate-700 uppercase tracking-tight">
                            {activeTab === 'pending' ? "Inbox is Clean!" : "No History Found"}
                        </h2>
                        <p className="text-slate-400 mt-2 font-medium max-w-sm mx-auto">
                            {activeTab === 'pending' 
                                ? "There are no applications currently waiting for manual oversight." 
                                : "You haven't finalized any adoption decisions yet."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredApplications.map((app) => (
                            <Card 
                                key={app._id} 
                                className={`border-none shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col rounded-3xl group relative cursor-pointer ${app.status === 'accepted' ? 'border-t-4 border-green-500' : app.status === 'rejected' ? 'border-t-4 border-red-500' : ''}`}
                                onClick={() => setSelectedApp(app)}
                            >
                                {processingApps[app._id] && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-20 flex items-center justify-center transition-all rounded-3xl">
                                        <div className="text-center">
                                            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-3" />
                                            <p className="text-sm font-black text-indigo-900 uppercase tracking-widest animate-pulse">
                                                {processingApps[app._id] === 'accept' ? 'Approving...' : 'Declining...'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                
                                <CardHeader className="bg-slate-50/80 p-6 pb-2 border-b border-slate-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge className={`${getStatusVariant(app.status)} px-3 py-1 rounded-full uppercase text-[10px] font-black tracking-widest`}>
                                            {app.status.replace('-', ' ')}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center bg-white px-2 py-1 rounded-xl border border-slate-100">
                                            <Clock size={10} className="mr-1" />
                                            {new Date(app.submissionDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight truncate flex items-center justify-between">
                                        {app.user?.userName}
                                        <ExternalLink size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                    </CardTitle>
                                    <CardDescription className="flex items-center text-indigo-600 font-black text-xs uppercase tracking-widest mt-1">
                                        🎯 TARGET: {app.pet?.name || 'Unnamed Pet'}
                                    </CardDescription>
                                </CardHeader>
                                
                                <CardContent className="p-6 flex-grow flex flex-col">
                                    <div className={`p-5 rounded-2xl border mb-6 transition-all duration-500 ${app.aiReview?.verdict === 'accept' ? 'bg-emerald-50 border-emerald-100 shadow-sm shadow-emerald-50' : 'bg-rose-50 border-rose-100 shadow-sm shadow-rose-50'}`}>
                                        <div className={`flex items-center gap-2 mb-3 font-black text-[10px] uppercase tracking-[0.2em] ${app.aiReview?.verdict === 'accept' ? 'text-emerald-700' : 'text-rose-700'}`}>
                                            <Brain size={14} className={app.aiReview?.verdict === 'accept' ? 'animate-pulse' : ''} />
                                            AI Assessment: {app.aiReview?.verdict || 'N/A'}
                                        </div>
                                        <p className="text-xs text-slate-600 font-bold leading-relaxed italic opacity-80">
                                            "{app.aiReview?.reason || 'System evaluating criteria...'}"
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 mb-8">
                                        <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mr-3">
                                                <User size={16} className="text-slate-400" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact Info</span>
                                                <span className="text-sm font-black text-slate-700 tracking-tight">{app.personalInfo?.phone || 'Private'}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col p-4 bg-slate-50 rounded-2xl border border-slate-100 min-h-[100px]">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                                                <MessageSquare size={12} className="mr-2" /> 
                                                Motivation Statement
                                            </span>
                                            <p className="text-xs font-bold text-slate-600 italic line-clamp-3">
                                                "{app.adoptionDetails?.reasonToAdopt || 'No statement provided.'}"
                                            </p>
                                        </div>
                                    </div>

                                    {activeTab === 'pending' && (
                                        <div className="flex gap-4 mt-auto">
                                            <Button 
                                                disabled={!!processingApps[app._id]}
                                                className="flex-1 bg-green-500 hover:bg-green-600 h-14 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-100 transition-all active:scale-95 border-b-4 border-green-700"
                                                onClick={(e) => { e.stopPropagation(); handleReview(app._id, 'accept'); }}
                                            >
                                                <CheckCircle size={20} className="mr-2" />
                                                Approve
                                            </Button>
                                            <Button 
                                                disabled={!!processingApps[app._id]}
                                                variant="destructive" 
                                                className="flex-1 bg-red-500 hover:bg-red-600 h-14 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-100 transition-all active:scale-95 border-b-4 border-red-700"
                                                onClick={(e) => { e.stopPropagation(); handleReview(app._id, 'reject'); }}
                                            >
                                                <XCircle size={20} className="mr-2" />
                                                Decline
                                            </Button>
                                        </div>
                                    )}

                                    {activeTab === 'reviewed' && (
                                        <div className={`mt-auto pt-4 flex items-center justify-center gap-2 font-black uppercase tracking-widest text-sm ${app.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>
                                            {app.status === 'accepted' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                            Final Decision: {app.status}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Detailed Application Modal */}
            <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-3xl border-none shadow-2xl">
                    <DialogHeader className="p-8 bg-indigo-950 text-white rounded-t-3xl border-b border-indigo-900">
                        <div className="flex justify-between items-start">
                            <div>
                                <Badge className={`${getStatusVariant(selectedApp?.status)} mb-4 px-4 py-1.5 rounded-full uppercase text-xs font-black tracking-[0.2em] shadow-lg`}>
                                    {selectedApp?.status.replace('-', ' ')}
                                </Badge>
                                <DialogTitle className="text-4xl font-black tracking-tighter uppercase mb-2">
                                    Adoption Dossier: {selectedApp?.user?.userName}
                                </DialogTitle>
                                <p className="text-indigo-300 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                    Applying for {selectedApp?.pet?.name || 'Unknown Pet'}
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex-grow overflow-y-auto p-8 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Personal Info */}
                            <div className="space-y-8">
                                <section>
                                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                        <User className="w-4 h-4" /> Personal Profile
                                    </h3>
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                                        <div>
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</Label>
                                            <p className="text-lg font-black text-slate-900">{selectedApp?.personalInfo?.fullName}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</Label>
                                                <p className="text-sm font-bold text-slate-700">{selectedApp?.personalInfo?.phone}</p>
                                            </div>
                                            <div>
                                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</Label>
                                                <p className="text-sm font-bold text-slate-700 truncate">{selectedApp?.personalInfo?.email}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Occupation</Label>
                                            <p className="text-sm font-bold text-slate-700">{selectedApp?.personalInfo?.occupation}</p>
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Working Hours</Label>
                                            <p className="text-sm font-bold text-slate-700">{selectedApp?.personalInfo?.workingHours}</p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                        <Home className="w-4 h-4" /> Living Situation
                                    </h3>
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Residence</Label>
                                                <p className="text-sm font-bold text-slate-700">{selectedApp?.livingConditions?.residenceType}</p>
                                            </div>
                                            <div>
                                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ownership</Label>
                                                <p className="text-sm font-bold text-slate-700">{selectedApp?.livingConditions?.ownershipStatus}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <Badge variant={selectedApp?.livingConditions?.hasYard ? "default" : "secondary"} className="rounded-lg font-black">
                                                {selectedApp?.livingConditions?.hasYard ? "Has Yard" : "No Yard"}
                                            </Badge>
                                            {selectedApp?.livingConditions?.hasYard && (
                                                <Badge variant={selectedApp?.livingConditions?.yardFenced ? "default" : "destructive"} className="rounded-lg font-black">
                                                    {selectedApp?.livingConditions?.yardFenced ? "Fenced" : "Not Fenced"}
                                                </Badge>
                                            )}
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Household</Label>
                                            <p className="text-sm font-bold text-slate-700">{selectedApp?.livingConditions?.householdMembers}</p>
                                        </div>
                                        {selectedApp?.livingConditions?.childrenAges && (
                                            <div>
                                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ages of Children</Label>
                                                <p className="text-sm font-bold text-slate-700">{selectedApp?.livingConditions?.childrenAges}</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>

                            {/* Pet Experience & Motivation */}
                            <div className="space-y-8">
                                <section>
                                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                        <ShieldQuestion className="w-4 h-4" /> Pet History
                                    </h3>
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                                        <div>
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Pets</Label>
                                            <p className="text-sm font-bold text-slate-700">{selectedApp?.petExperience?.currentPets || 'None'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Previous Experience</Label>
                                            <p className="text-sm font-bold text-slate-700">{selectedApp?.petExperience?.previousPets}</p>
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Training Approach</Label>
                                            <p className="text-sm font-bold text-slate-700">{selectedApp?.petExperience?.trainingExperience}</p>
                                            {selectedApp?.petExperience?.petAllergies && (
                                                <p className="text-xs text-rose-500 font-bold mt-2">Allergies: {selectedApp.petExperience.petAllergies}</p>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                        <Heart className="w-4 h-4" /> Adoption Motivation
                                    </h3>
                                    <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 space-y-4">
                                        <div>
                                            <Label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Reason to Adopt</Label>
                                            <p className="text-sm font-bold text-indigo-900 italic">"{selectedApp?.adoptionDetails?.reasonToAdopt}"</p>
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Exercise Plan</Label>
                                            <p className="text-sm font-bold text-indigo-900">{selectedApp?.adoptionDetails?.exercisePlan}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Engagement</Label>
                                                <p className="text-sm font-bold text-indigo-900">{selectedApp?.adoptionDetails?.timeWithPet}</p>
                                            </div>
                                            <div>
                                                <Label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Budgeting</Label>
                                                <p className="text-sm font-bold text-indigo-900">{selectedApp?.adoptionDetails?.petExpenses}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Vacation Management</Label>
                                            <p className="text-sm font-bold text-indigo-900">{selectedApp?.adoptionDetails?.vacationPlan}</p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* AI Summary Block */}
                        <section className="mt-12 bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-8xl pointer-events-none group-hover:scale-110 transition-transform">AI</div>
                           <div className="relative z-10">
                                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-indigo-400" /> Neural Assessment Analysis
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                    <div className="lg:col-span-1">
                                        <div className={`text-4xl font-black uppercase tracking-tighter mb-1 ${selectedApp?.aiReview?.verdict === 'accept' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {selectedApp?.aiReview?.verdict}
                                        </div>
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest underline decoration-indigo-500 underline-offset-4">Machine Recommendation</div>
                                    </div>
                                    <div className="lg:col-span-3">
                                        <p className="text-lg font-bold text-slate-100 leading-relaxed italic border-l-4 border-indigo-600 pl-6 py-2">
                                            "{selectedApp?.aiReview?.reason}"
                                        </p>
                                    </div>
                                </div>
                           </div>
                        </section>
                    </div>

                    <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Submitted on {new Date(selectedApp?.submissionDate).toLocaleDateString()} at {new Date(selectedApp?.submissionDate).toLocaleTimeString()}
                        </div>
                        {['ai-reviewed', 'under-manual-review'].includes(selectedApp?.status) && (
                            <div className="flex gap-4">
                                <Button 
                                    className="bg-green-600 hover:bg-green-700 h-14 rounded-2xl px-12 font-black text-base uppercase tracking-widest shadow-xl shadow-green-100"
                                    onClick={() => handleReview(selectedApp?._id, 'accept')}
                                >
                                    APPROVE
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    className="bg-red-600 hover:bg-red-700 h-14 rounded-2xl px-12 font-black text-base uppercase tracking-widest shadow-xl shadow-red-100"
                                    onClick={() => handleReview(selectedApp?._id, 'reject')}
                                >
                                    DECLINE
                                </Button>
                            </div>
                        )}
                        {['accepted', 'rejected'].includes(selectedApp?.status) && (
                            <Button variant="outline" className="h-14 rounded-2xl px-12 font-black uppercase tracking-widest border-2" onClick={() => setSelectedApp(null)}>
                                Close Record
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MainShelterAdmin;
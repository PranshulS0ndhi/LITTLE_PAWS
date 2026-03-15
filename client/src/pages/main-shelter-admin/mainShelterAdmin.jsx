import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import MainNavbar from '@/components/main-navbar/MainNavbar';
import { Brain, Filter, CheckCircle, XCircle, Clock, User, MessageSquare, Loader2 } from 'lucide-react';

const MainShelterAdmin = () => {
    const { user } = useSelector(state => state.auth);
    const [applications, setApplications] = useState([]);
    const [aiMode, setAiMode] = useState('complete');
    const [loading, setLoading] = useState(true);
    const [processingApps, setProcessingApps] = useState({}); // Track loading state per application
    const { toast } = useToast();

    const fetchApplications = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/shelterAdmin/applications', { withCredentials: true });
            if (response.data.success) {
                // If silent fetch and count increased, show toast
                if (silent && response.data.applications.length > applications.length) {
                    const newCount = response.data.applications.length - applications.length;
                    toast({
                        title: "New Application Received!",
                        description: `You have ${newCount} new request(s) to review.`,
                        variant: "default"
                    });
                }
                setApplications(response.data.applications);
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

        // 10-second polling for real-time updates without refreshing
        const interval = setInterval(() => {
            fetchApplications(true); // silent fetch
        }, 10000);

        return () => clearInterval(interval);
    }, []);

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
        // Set processing state for this specific app
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
                
                // Optimistically update local state for immediate feedback
                setApplications(prev => prev.map(app => 
                    app._id === appId ? { ...app, status: action === 'accept' ? 'accepted' : 'rejected' } : app
                ));
            }
        } catch (error) {
            console.error(`Error ${action}ing application:`, error);
            toast({ title: `Failed to ${action} application`, variant: "destructive" });
        } finally {
            // Remove processing state
            setProcessingApps(prev => {
                const newState = { ...prev };
                delete newState[appId];
                return newState;
            });
            // Re-fetch to ensure sync with server
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

    return (
        <div className="min-h-screen bg-slate-50">
            <MainNavbar />
            <div className="max-w-7xl mx-auto p-6 pt-24 pb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shelter Admin Dashboard</h1>
                        <p className="text-slate-500 mt-1 font-medium">Review AI-filtered adoption applications for {user?.city} shelter</p>
                    </div>

                    <div className="flex items-center space-x-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <div className="flex flex-col items-end mr-2">
                            <span className="text-sm font-bold text-indigo-900 uppercase tracking-wider">Review Mode</span>
                            <span className="text-xs text-indigo-600 font-semibold">{aiMode === 'complete' ? 'AUTONOMOUS' : 'MANUAL OVERSIGHT'}</span>
                        </div>
                        <Switch 
                            checked={aiMode === 'complete'}
                            onCheckedChange={handleToggleMode}
                            className="data-[state=checked]:bg-indigo-600"
                        />
                        <Brain className={`w-5 h-5 ${aiMode === 'complete' ? 'text-indigo-600 animate-pulse' : 'text-slate-400'}`} />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="h-80 bg-slate-200 rounded-3xl"></div>)}
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Filter className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-700">No applications to review</h2>
                        <p className="text-slate-400 mt-2 max-w-sm mx-auto">All applications for your shelter have been processed. New ones will appear after AI review.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {applications.map((app) => (
                            <Card key={app._id} className="border-none shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col rounded-3xl group relative">
                                {processingApps[app._id] && (
                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center transition-all">
                                        <div className="text-center">
                                            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-2" />
                                            <p className="text-sm font-bold text-indigo-900 uppercase tracking-widest">
                                                {processingApps[app._id] === 'accept' ? 'Accepting...' : 'Rejecting...'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                
                                <CardHeader className="bg-slate-50/80 p-6 pb-2 border-b border-slate-100">
                                    <div className="flex justify-between items-start mb-3">
                                        <Badge className={`${getStatusVariant(app.status)} px-3 py-1 rounded-full uppercase text-[10px] font-bold tracking-wider`}>
                                            {app.status.replace('-', ' ')}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center bg-white px-2 py-1 rounded-md border border-slate-100">
                                            <Clock size={10} className="mr-1" />
                                            {new Date(app.submissionDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <CardTitle className="text-2xl font-black text-slate-800 truncate">{app.user?.userName}</CardTitle>
                                    <CardDescription className="flex items-center text-indigo-600 font-bold pb-2 text-sm uppercase tracking-tight">
                                        Pet: {app.pet?.name || 'Unnamed'}
                                    </CardDescription>
                                </CardHeader>
                                
                                <CardContent className="p-6 flex-grow flex flex-col">
                                    <div className={`p-4 rounded-2xl border mb-6 transition-colors duration-500 ${app.aiReview?.verdict === 'accept' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                                        <div className={`flex items-center gap-2 mb-2 font-black text-xs uppercase tracking-widest ${app.aiReview?.verdict === 'accept' ? 'text-emerald-700' : 'text-rose-700'}`}>
                                            <Brain size={14} className={app.aiReview?.verdict === 'accept' ? 'animate-pulse' : ''} />
                                            AI Verdict: {app.aiReview?.verdict || 'N/A'}
                                        </div>
                                        <p className="text-xs text-slate-600 italic font-medium leading-relaxed italic">
                                            "{app.aiReview?.reason || 'No specific reasoning provided.'}"
                                        </p>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center text-sm font-semibold text-slate-600">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                                                <User size={14} className="text-slate-500" />
                                            </div>
                                            {app.personalInfo?.phone || 'No phone provided'}
                                        </div>
                                        <div className="flex items-start text-sm font-medium text-slate-500">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 shrink-0">
                                                <MessageSquare size={14} className="text-slate-500" />
                                            </div>
                                            <span className="line-clamp-3 bg-slate-50 p-2 rounded-lg italic border border-slate-100 w-full text-xs">
                                                "{app.adoptionDetails?.reasonToAdopt || 'No reason provided.'}"
                                            </span>
                                        </div>
                                    </div>

                                    {(app.status === 'ai-reviewed' || app.status === 'under-manual-review') && (
                                        <div className="flex gap-4 mt-auto">
                                            <Button 
                                                disabled={!!processingApps[app._id]}
                                                className="flex-1 bg-green-600 hover:bg-green-700 h-12 rounded-xl font-bold shadow-lg shadow-green-100 transition-all active:scale-95"
                                                onClick={() => handleReview(app._id, 'accept')}
                                            >
                                                <CheckCircle size={20} className="mr-2" />
                                                ACCEPT
                                            </Button>
                                            <Button 
                                                disabled={!!processingApps[app._id]}
                                                variant="destructive" 
                                                className="flex-1 bg-red-600 hover:bg-red-700 h-12 rounded-xl font-bold shadow-lg shadow-red-100 transition-all active:scale-95"
                                                onClick={() => handleReview(app._id, 'reject')}
                                            >
                                                <XCircle size={20} className="mr-2" />
                                                REJECT
                                            </Button>
                                        </div>
                                    )}

                                    {(app.status === 'accepted' || app.status === 'rejected') && (
                                        <div className={`mt-auto pt-4 text-center font-black uppercase tracking-tighter text-2xl opacity-20 select-none`}>
                                            {app.status}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainShelterAdmin;
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
import { Brain, Filter, CheckCircle, XCircle, Clock, User, MessageSquare } from 'lucide-react';

const MainShelterAdmin = () => {
    const { user } = useSelector(state => state.auth);
    const [applications, setApplications] = useState([]);
    const [aiMode, setAiMode] = useState('complete');
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchApplications = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/shelterAdmin/applications', { withCredentials: true });
            if (response.data.success) {
                setApplications(response.data.applications);
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
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
        const url = action === 'accept' 
            ? `http://localhost:5000/api/shelterAdmin/applications/${appId}`
            : `http://localhost:5000/api/shelterAdmin/applications/reject/${appId}`;
        
        try {
            const response = await axios.put(url, {}, { withCredentials: true });
            if (response.data.success) {
                toast({ title: `Application ${action}ed successfully` });
                fetchApplications();
            }
        } catch (error) {
            toast({ title: `Failed to ${action} application`, variant: "destructive" });
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'ai-reviewed': return 'bg-blue-100 text-blue-800';
            case 'under-manual-review': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <MainNavbar />
            <div className="max-w-7xl mx-auto p-6 pt-24">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Shelter Admin Dashboard</h1>
                        <p className="text-slate-500 mt-1">Review AI-filtered adoption applications</p>
                    </div>

                    <div className="flex items-center space-x-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <div className="flex flex-col items-end mr-2">
                            <span className="text-sm font-semibold text-indigo-900">Review Mode</span>
                            <span className="text-xs text-indigo-600">{aiMode === 'complete' ? 'Autonomous AI' : 'Manual Oversight'}</span>
                        </div>
                        <Switch 
                            checked={aiMode === 'complete'}
                            onCheckedChange={handleToggleMode}
                            className="data-[state=checked]:bg-indigo-600"
                        />
                        <Brain className={`w-5 h-5 ${aiMode === 'complete' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(n => <div key={n} className="h-64 bg-slate-200 rounded-2xl"></div>)}
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-slate-600">No applications to review yet</h2>
                        <p className="text-slate-400">Applications will appear here after AI processing.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applications.map((app) => (
                            <Card key={app._id} className="border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col rounded-2xl group">
                                <CardHeader className="bg-slate-50/50 p-5 pb-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge className={getStatusVariant(app.status)}>
                                            {app.status.replace('-', ' ')}
                                        </Badge>
                                        <span className="text-xs text-slate-400 flex items-center">
                                            <Clock size={12} className="mr-1" />
                                            {new Date(app.submissionDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl text-slate-800">{app.user?.userName}</CardTitle>
                                    <CardDescription className="flex items-center text-indigo-600 font-medium pb-2">
                                        Applying for {app.pet?.name}
                                    </CardDescription>
                                </CardHeader>
                                
                                <CardContent className="p-5 flex-grow">
                                    <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 mb-4">
                                        <div className="flex items-center gap-2 mb-2 text-indigo-900 font-bold text-sm">
                                            <Brain size={16} />
                                            AI VERDICT: {app.aiReview?.verdict?.toUpperCase()}
                                        </div>
                                        <p className="text-sm text-slate-600 italic leading-relaxed">
                                            "{app.aiReview?.reason}"
                                        </p>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center text-sm text-slate-500">
                                            <User size={14} className="mr-2" />
                                            {app.personalInfo?.phone}
                                        </div>
                                        <div className="flex items-start text-sm text-slate-500">
                                            <MessageSquare size={14} className="mr-2 mt-1 shrink-0" />
                                            <span className="line-clamp-2">{app.adoptionDetails?.reasonToAdopt}</span>
                                        </div>
                                    </div>

                                    {(app.status === 'ai-reviewed' || app.status === 'under-manual-review') && (
                                        <div className="flex gap-3 mt-auto pt-2">
                                            <Button 
                                                className="flex-1 bg-green-600 hover:bg-green-700 h-10 rounded-lg font-semibold"
                                                onClick={() => handleReview(app._id, 'accept')}
                                            >
                                                <CheckCircle size={18} className="mr-2" />
                                                Accept
                                            </Button>
                                            <Button 
                                                variant="destructive" 
                                                className="flex-1 bg-red-600 hover:bg-red-700 h-10 rounded-lg font-semibold"
                                                onClick={() => handleReview(app._id, 'reject')}
                                            >
                                                <XCircle size={18} className="mr-2" />
                                                Reject
                                            </Button>
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
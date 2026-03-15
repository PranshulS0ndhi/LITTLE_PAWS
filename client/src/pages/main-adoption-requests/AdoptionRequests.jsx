import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainNavbar from '@/components/main-navbar/MainNavbar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Calendar, Info } from 'lucide-react';

const AdoptionRequests = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/adoptions/my-applications', {
                    withCredentials: true
                });
                if (response.data.success) {
                    setApplications(response.data.applications);
                }
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const getStatusBadge = (status) => {
        const statusMap = {
            'under-review': { color: 'bg-yellow-100 text-yellow-800', label: 'Under AI Review' },
            'ai-reviewed': { color: 'bg-blue-100 text-blue-800', label: 'AI Reviewed' },
            'under-manual-review': { color: 'bg-orange-100 text-orange-800', label: 'Under Manual Review' },
            'accepted': { color: 'bg-green-100 text-green-800', label: 'Accepted' },
            'rejected': { color: 'bg-red-100 text-red-800', label: 'Rejected' }
        };
        const config = statusMap[status] || { color: 'bg-gray-100 text-gray-800', label: status };
        return <Badge className={config.color}>{config.label}</Badge>;
    };

    if (loading) return <div>Loading your applications...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <MainNavbar />
            <div className="max-w-6xl mx-auto p-6 mt-16">
                <h1 className="text-3xl font-bold mb-8 text-indigo-900">My Adoption Requests</h1>
                
                {applications.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-500 text-lg">You haven't submitted any adoption applications yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applications.map((app) => (
                            <Card 
                                key={app._id} 
                                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-none shadow-sm group"
                                onClick={() => navigate(`/applicationStatus/${app._id}`)}
                            >
                                <CardHeader className="p-0">
                                    <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                                        <img 
                                            src={app.pet?.pictures?.[0] || '/placeholder-pet.jpg'} 
                                            alt={app.pet?.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3">
                                            {getStatusBadge(app.status)}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <CardTitle className="text-xl mb-1 text-gray-800">{app.pet?.name || 'Unnamed Pet'}</CardTitle>
                                    <CardDescription className="flex items-center text-gray-500 text-sm mb-4">
                                        <Calendar size={14} className="mr-1" />
                                        Applied on {new Date(app.submissionDate).toLocaleDateString()}
                                    </CardDescription>
                                    
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                        <span className="text-sm font-medium text-indigo-600 flex items-center">
                                            <Info size={14} className="mr-1" />
                                            View Progress
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdoptionRequests;

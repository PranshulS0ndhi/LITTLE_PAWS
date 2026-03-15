import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Clock, ArrowLeft, BrainCircuit, Activity } from 'lucide-react';
import axios from "axios";
import MainNavbar from '@/components/main-navbar/MainNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const ApplicationStatus = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdoptionStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/adoptions/status/${id}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setApplication(response.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAdoptionStatus();
    }
  }, [id]);

  const statusConfigs = {
    'under-review': {
      icon: <Clock className="w-16 h-16 text-yellow-500 mb-4 animate-pulse" />,
      bgClass: 'bg-yellow-50 border-yellow-100',
      textClass: 'text-yellow-800',
      title: 'Under AI Review',
      message: 'Our AI is currently analyzing your application to ensure the best match.',
      description: 'This usually takes less than a minute. We evaluate your profile against the pet\'s needs.'
    },
    'ai-reviewed': {
      icon: <BrainCircuit className="w-16 h-16 text-blue-500 mb-4" />,
      bgClass: 'bg-blue-50 border-blue-100',
      textClass: 'text-blue-800',
      title: 'AI Review Complete',
      message: 'The initial AI assessment is complete.',
      description: 'Your application is now waiting for final confirmation from the shelter staff.'
    },
    'under-manual-review': {
      icon: <Activity className="w-16 h-16 text-orange-500 mb-4" />,
      bgClass: 'bg-orange-50 border-orange-100',
      textClass: 'text-orange-800',
      title: 'Under Manual Review',
      message: 'Shelter staff are currently reviewing your application details.',
      description: 'They are looking at the specifics of your living conditions and experience.'
    },
    'accepted': {
      icon: <CheckCircle className="w-16 h-16 text-green-500 mb-4" />,
      bgClass: 'bg-green-50 border-green-100',
      textClass: 'text-green-800',
      title: 'Congratulations!',
      message: 'Your application has been accepted.',
      description: 'The shelter will contact you shortly to arrange a meeting with your new friend!'
    },
    'rejected': {
      icon: <AlertCircle className="w-16 h-16 text-red-500 mb-4" />,
      bgClass: 'bg-red-50 border-red-100',
      textClass: 'text-red-800',
      title: 'Application Update',
      message: 'Your application was not approved at this time.',
      description: 'Please see the reason below for more details.'
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <MainNavbar />
        <div className="max-w-xl mx-auto pt-32 px-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-slate-50">
        <MainNavbar />
        <div className="max-w-xl mx-auto pt-32 px-4 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Status</h2>
          <p className="text-gray-600 mb-6">{error || "Application not found"}</p>
          <Link to="/applicationStatus" className="text-indigo-600 font-semibold flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Applications
          </Link>
        </div>
      </div>
    );
  }

  const config = statusConfigs[application.status] || statusConfigs['under-review'];

  return (
    <div className="min-h-screen bg-slate-50">
      <MainNavbar />
      <div className="max-w-xl mx-auto pt-32 px-4 pb-12">
        <Link to="/applicationStatus" className="text-gray-500 hover:text-gray-800 mb-6 inline-flex items-center transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Applications
        </Link>
        
        <Card className={`border-2 shadow-xl overflow-hidden ${config.bgClass}`}>
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center">{config.icon}</div>
            <CardTitle className={`text-3xl font-bold ${config.textClass}`}>
              {config.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <p className={`text-lg font-medium mb-4 ${config.textClass}`}>
              {config.message}
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {config.description}
            </p>

            {application.aiReview?.reason && (
              <div className="mt-8 bg-white/60 rounded-xl p-6 text-left border border-white">
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4" />
                  AI Assessment Note:
                </h4>
                <p className="text-gray-700 italic">
                  "{application.aiReview.reason}"
                </p>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Application ID:</span>
                <span className="font-mono text-xs">{id}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationStatus;
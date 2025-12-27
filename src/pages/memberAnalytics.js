import React, { useState, useEffect } from 'react';
import { FaChartBar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const MemberAnalytics = () => {
  const { user, isAdmin, token } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data with all required metrics - will be replaced with MongoDB data
  const mockData = [
    {
      name: "John Smith",
      instrument: "Guitar",
      competence: 4.5,
      commitment: 4.8,
      spiritualMaturity: 4.2,
      consistency: 4.6,
      trainability: 4.7,
      responsivenessToFeedback: 4.9
    },
    {
      name: "Sarah Johnson",
      instrument: "Vocals",
      competence: 4.8,
      commitment: 4.9,
      spiritualMaturity: 4.7,
      consistency: 4.8,
      trainability: 4.6,
      responsivenessToFeedback: 4.8
    },
    {
      name: "Mike Wilson",
      instrument: "Drums",
      competence: 4.2,
      commitment: 4.1,
      spiritualMaturity: 3.9,
      consistency: 4.0,
      trainability: 4.3,
      responsivenessToFeedback: 4.2
    },
    {
      name: "Emily Davis",
      instrument: "Piano",
      competence: 4.7,
      commitment: 4.6,
      spiritualMaturity: 4.8,
      consistency: 4.5,
      trainability: 4.4,
      responsivenessToFeedback: 4.7
    },
    {
      name: "David Brown",
      instrument: "Bass",
      competence: 4.1,
      commitment: 4.3,
      spiritualMaturity: 4.1,
      consistency: 3.9,
      trainability: 4.5,
      responsivenessToFeedback: 4.4
    }
  ];

  useEffect(() => {
    if (isAdmin && token) {
      fetchAnalyticsData();
    }
  }, [isAdmin, token]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from MongoDB API with authentication
      const response = await axios.get(API_ENDPOINTS.MEMBER_ANALYTICS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMembers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Fallback to mock data if API fails
      setMembers(mockData);
      setLoading(false);
    }
  };

  const getOverallScore = (member) => {
    const scores = [
      member.competence,
      member.commitment,
      member.spiritualMaturity,
      member.consistency,
      member.trainability,
      member.responsivenessToFeedback
    ];
    return (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1);
  };

  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-yellow-600';
    if (score >= 3.5) return 'text-orange-500';
    return 'text-red-500';
  };


  const getTeamStats = () => {
    if (members.length === 0) return {};
    const avgScore = (members.reduce((sum, member) => sum + parseFloat(getOverallScore(member)), 0) / members.length).toFixed(1);
    return { avgScore, totalMembers: members.length };
  };

  const stats = getTeamStats();

  // Show access denied for non-admin users
  if (!isAdmin) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="text-center bg-white border-2 border-primary rounded-2xl p-8 mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaChartBar className="text-2xl text-red-500" />
          </div>
          <h3 className="text-lg font-black text-black mb-2">Access Restricted</h3>
          <p className="text-gray-600 text-sm">Analytics is only available to admin users.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FaChartBar className="text-2xl text-white" />
          </div>
          <h3 className="text-lg font-black text-black mb-2">Loading Analytics</h3>
          <p className="text-gray-600 text-sm">Fetching worship team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="pt-8 pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-black">Member Analytics</h1>
          <p className="text-gray-600 text-sm">Team performance overview</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-primary text-white rounded-2xl p-4">
            <div className="text-2xl font-black mb-1">{stats.totalMembers || 0}</div>
            <div className="text-white/80 text-sm">Total Members</div>
          </div>

          <div className="bg-white border-2 border-black rounded-2xl p-4">
            <div className={`text-2xl font-black mb-1 text-black`}>{stats.avgScore || '0.0'}</div>
            <div className="text-gray-600 text-sm">Average Score</div>
          </div>
        </div>


        {/* Members Detailed List */}
        <div className="space-y-4">
          {members.map((member, index) => (
            <div key={member.name || index} className="bg-white border-2 border-black rounded-2xl p-6">
              {/* Member Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-black text-black">{member.name}</h3>
                  <p className="text-gray-600 text-sm">{member.instrument}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-black">
                    {getOverallScore(member)}
                  </div>
                  <div className="text-xs text-black">Overall Score</div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'competence', label: 'Competence' },
                  { key: 'commitment', label: 'Commitment' },
                  { key: 'spiritualMaturity', label: 'Spiritual Maturity' },
                  { key: 'consistency', label: 'Consistency' },
                  { key: 'trainability', label: 'Trainability' },
                  { key: 'responsivenessToFeedback', label: 'Responsiveness to Feedback' }
                ].map(metric => (
                  <div key={metric.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                      <span className="text-sm font-black text-black">
                        {member[metric.key] || '0.0'}
                      </span>
                    </div>
                    <div className="w-full bg-red-50 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${((member[metric.key] || 0) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberAnalytics;

import { useState } from "react";
import { Upload, FileText, Users, CheckCircle, Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import JobDescriptionUpload from "@/components/JobDescriptionUpload";
import CVUpload from "@/components/CVUpload";
import MatchResults from "@/components/MatchResults";
import ShortlistView from "@/components/ShortlistView";
import { Candidate, JobDescription } from "@/types/screening";

const Index = () => {
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState<Candidate[]>([]);
  const [activeTab, setActiveTab] = useState("upload-jd");

  const handleJobDescriptionUpload = (jd: JobDescription) => {
    setJobDescription(jd);
    setActiveTab("upload-cvs");
  };

  const handleCVsUploaded = (uploadedCandidates: Candidate[]) => {
    setCandidates(uploadedCandidates);
    setActiveTab("matches");
  };

  const handleShortlist = (candidate: Candidate) => {
    const updatedCandidate = { ...candidate, status: "shortlisted" as const };
    setCandidates(prev => 
      prev.map(c => c.id === candidate.id ? updatedCandidate : c)
    );
    setShortlistedCandidates(prev => [...prev, updatedCandidate]);
  };

  const handleReject = (candidate: Candidate) => {
    const updatedCandidate = { ...candidate, status: "rejected" as const };
    setCandidates(prev => 
      prev.map(c => c.id === candidate.id ? updatedCandidate : c)
    );
    setShortlistedCandidates(prev => 
      prev.filter(c => c.id !== candidate.id)
    );
  };

  const stats = [
    {
      title: "Job Description",
      value: jobDescription ? "Uploaded" : "Pending",
      icon: Briefcase,
      status: jobDescription ? "complete" : "pending"
    },
    {
      title: "CVs Uploaded",
      value: candidates.length.toString(),
      icon: FileText,
      status: candidates.length > 0 ? "complete" : "pending"
    },
    {
      title: "Shortlisted",
      value: shortlistedCandidates.length.toString(),
      icon: CheckCircle,
      status: shortlistedCandidates.length > 0 ? "complete" : "pending"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Job Screener</h1>
                <p className="text-sm text-gray-500">Intelligent Candidate Matching</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Multi-Agent AI System
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${
                      stat.status === "complete" ? "bg-green-100" : "bg-gray-100"
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        stat.status === "complete" ? "text-green-600" : "text-gray-400"
                      }`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">Screening Workflow</CardTitle>
            <CardDescription>
              Follow the steps below to screen candidates efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="upload-jd" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload JD
                </TabsTrigger>
                <TabsTrigger value="upload-cvs" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Upload CVs
                </TabsTrigger>
                <TabsTrigger value="matches" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  View Matches
                </TabsTrigger>
                <TabsTrigger value="shortlist" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Shortlist
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload-jd" className="space-y-6">
                <JobDescriptionUpload onUpload={handleJobDescriptionUpload} />
              </TabsContent>

              <TabsContent value="upload-cvs" className="space-y-6">
                <CVUpload 
                  jobDescription={jobDescription}
                  onCVsUploaded={handleCVsUploaded}
                />
              </TabsContent>

              <TabsContent value="matches" className="space-y-6">
                <MatchResults 
                  candidates={candidates}
                  jobDescription={jobDescription}
                  onShortlist={handleShortlist}
                  onReject={handleReject}
                />
              </TabsContent>

              <TabsContent value="shortlist" className="space-y-6">
                <ShortlistView 
                  shortlistedCandidates={shortlistedCandidates}
                  jobDescription={jobDescription}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

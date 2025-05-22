
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, X, User, Mail, Phone, FileText, Award } from "lucide-react";
import { Candidate, JobDescription } from "@/types/screening";

interface MatchResultsProps {
  candidates: Candidate[];
  jobDescription: JobDescription | null;
  onShortlist: (candidate: Candidate) => void;
  onReject: (candidate: Candidate) => void;
}

const MatchResults = ({ candidates, jobDescription, onShortlist, onReject }: MatchResultsProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortBy, setSortBy] = useState<"score" | "name">("score");

  const sortedCandidates = [...candidates].sort((a, b) => {
    if (sortBy === "score") return b.matchScore - a.matchScore;
    return a.name.localeCompare(b.name);
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100 border-green-200";
    if (score >= 60) return "bg-yellow-100 border-yellow-200";
    return "bg-red-100 border-red-200";
  };

  if (!jobDescription) {
    return (
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-6 text-center">
          <FileText className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">No Job Description</h3>
          <p className="text-amber-600">Please upload a job description first.</p>
        </CardContent>
      </Card>
    );
  }

  if (candidates.length === 0) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <User className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">No Candidates Yet</h3>
          <p className="text-blue-600">Upload some CV files to see matching results.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats and controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Match Results</CardTitle>
              <CardDescription>
                {candidates.length} candidates matched against <strong>{jobDescription.title}</strong>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "score" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("score")}
              >
                Sort by Score
              </Button>
              <Button
                variant={sortBy === "name" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("name")}
              >
                Sort by Name
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {candidates.filter(c => c.matchScore >= 80).length}
              </p>
              <p className="text-sm text-gray-600">Excellent Match (80%+)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {candidates.filter(c => c.matchScore >= 60 && c.matchScore < 80).length}
              </p>
              <p className="text-sm text-gray-600">Good Match (60-79%)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {candidates.filter(c => c.matchScore < 60).length}
              </p>
              <p className="text-sm text-gray-600">Poor Match (&lt;60%)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {candidates.filter(c => c.status === "shortlisted").length}
              </p>
              <p className="text-sm text-gray-600">Shortlisted</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates List */}
      <div className="grid gap-6">
        {sortedCandidates.map((candidate) => (
          <Card key={candidate.id} className={`border-l-4 ${
            candidate.status === "shortlisted" ? "border-l-green-500 bg-green-50" :
            candidate.status === "rejected" ? "border-l-red-500 bg-red-50" :
            "border-l-blue-500"
          }`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {candidate.email}
                      </div>
                      {candidate.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {candidate.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(candidate.matchScore)}`}>
                    {candidate.matchScore}%
                  </div>
                  <Badge variant={
                    candidate.matchScore >= 80 ? "default" :
                    candidate.matchScore >= 60 ? "secondary" : "destructive"
                  }>
                    {candidate.matchScore >= 80 ? "Excellent" :
                     candidate.matchScore >= 60 ? "Good" : "Poor"} Match
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Match Score</h4>
                    <Progress value={candidate.matchScore} className="h-3" />
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                    <p className="text-gray-600">{candidate.experience}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                    <p className="text-gray-600 text-sm">{candidate.summary}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Matched Skills ({candidate.matchedSkills.length})</h4>
                    <div className="flex flex-wrap gap-1">
                      {candidate.matchedSkills.map((skill, index) => (
                        <Badge key={index} variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {candidate.missingSkills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Missing Skills ({candidate.missingSkills.length})</h4>
                      <div className="flex flex-wrap gap-1">
                        {candidate.missingSkills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-red-600 border-red-200">
                            <X className="h-3 w-3 mr-1" />
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <FileText className="h-4 w-4" />
                    {candidate.fileName} • {(candidate.fileSize / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>

              {candidate.status === "pending" && (
                <div className="flex gap-3 mt-6 pt-4 border-t">
                  <Button
                    onClick={() => onShortlist(candidate)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Shortlist Candidate
                  </Button>
                  <Button
                    onClick={() => onReject(candidate)}
                    variant="outline"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}

              {candidate.status !== "pending" && (
                <div className="mt-6 pt-4 border-t">
                  <Badge variant={candidate.status === "shortlisted" ? "default" : "destructive"} className="text-sm px-3 py-1">
                    {candidate.status === "shortlisted" ? "Shortlisted" : "Rejected"}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MatchResults;

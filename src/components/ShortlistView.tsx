
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle, Mail, Phone, Send, Award, Calendar, MapPin } from "lucide-react";
import { Candidate, JobDescription } from "@/types/screening";
import { useToast } from "@/hooks/use-toast";

interface ShortlistViewProps {
  shortlistedCandidates: Candidate[];
  jobDescription: JobDescription | null;
}

const ShortlistView = ({ shortlistedCandidates, jobDescription }: ShortlistViewProps) => {
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [invitationData, setInvitationData] = useState({
    subject: "",
    message: "",
    interviewDate: "",
    interviewTime: "",
    location: "Video Call"
  });
  const { toast } = useToast();

  const toggleCandidateSelection = (candidateId: string) => {
    const newSelected = new Set(selectedCandidates);
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId);
    } else {
      newSelected.add(candidateId);
    }
    setSelectedCandidates(newSelected);
  };

  const selectAllCandidates = () => {
    if (selectedCandidates.size === shortlistedCandidates.length) {
      setSelectedCandidates(new Set());
    } else {
      setSelectedCandidates(new Set(shortlistedCandidates.map(c => c.id)));
    }
  };

  const sendInvitations = () => {
    if (selectedCandidates.size === 0) {
      toast({
        title: "No candidates selected",
        description: "Please select at least one candidate to send invitations.",
        variant: "destructive"
      });
      return;
    }

    // Simulate sending invitations
    toast({
      title: "Invitations sent successfully",
      description: `Interview invitations sent to ${selectedCandidates.size} candidates.`,
    });

    setSelectedCandidates(new Set());
  };

  // Pre-fill invitation template
  const fillTemplate = () => {
    if (jobDescription) {
      setInvitationData({
        subject: `Interview Invitation - ${jobDescription.title} at ${jobDescription.company}`,
        message: `Dear [Candidate Name],

We are pleased to invite you for an interview for the ${jobDescription.title} position at ${jobDescription.company}.

Based on your impressive background and qualifications, we believe you would be an excellent fit for our team.

Interview Details:
- Position: ${jobDescription.title}
- Date: [Interview Date]
- Time: [Interview Time]
- Location: [Interview Location]

Please confirm your availability by replying to this email.

We look forward to meeting you!

Best regards,
Hiring Team
${jobDescription.company}`,
        interviewDate: "",
        interviewTime: "",
        location: "Video Call"
      });
    }
  };

  if (!jobDescription) {
    return (
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-6 text-center">
          <Award className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">No Job Description</h3>
          <p className="text-amber-600">Please upload a job description first.</p>
        </CardContent>
      </Card>
    );
  }

  if (shortlistedCandidates.length === 0) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">No Shortlisted Candidates</h3>
          <p className="text-blue-600">Review candidates in the Matches tab and shortlist them to see them here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Award className="h-6 w-6 text-green-600" />
                Shortlisted Candidates
              </CardTitle>
              <CardDescription>
                {shortlistedCandidates.length} candidates shortlisted for <strong>{jobDescription.title}</strong>
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={selectAllCandidates}>
                {selectedCandidates.size === shortlistedCandidates.length ? "Deselect All" : "Select All"}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={fillTemplate}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invitations ({selectedCandidates.size})
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Send Interview Invitations</DialogTitle>
                    <DialogDescription>
                      Customize the invitation message for selected candidates
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="interview-date">Interview Date</Label>
                        <Input
                          id="interview-date"
                          type="date"
                          value={invitationData.interviewDate}
                          onChange={(e) => setInvitationData(prev => ({ ...prev, interviewDate: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interview-time">Interview Time</Label>
                        <Input
                          id="interview-time"
                          type="time"
                          value={invitationData.interviewTime}
                          onChange={(e) => setInvitationData(prev => ({ ...prev, interviewTime: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Interview Location</Label>
                      <Input
                        id="location"
                        value={invitationData.location}
                        onChange={(e) => setInvitationData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g., Video Call, Office Address, etc."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Email Subject</Label>
                      <Input
                        id="subject"
                        value={invitationData.subject}
                        onChange={(e) => setInvitationData(prev => ({ ...prev, subject: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        className="min-h-[200px]"
                        value={invitationData.message}
                        onChange={(e) => setInvitationData(prev => ({ ...prev, message: e.target.value }))}
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button variant="outline">Preview</Button>
                      <Button onClick={sendInvitations} className="bg-green-600 hover:bg-green-700">
                        Send to {selectedCandidates.size} Candidates
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{shortlistedCandidates.length}</p>
              <p className="text-sm text-gray-600">Total Shortlisted</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{selectedCandidates.size}</p>
              <p className="text-sm text-gray-600">Selected for Invitation</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(shortlistedCandidates.reduce((sum, c) => sum + c.matchScore, 0) / shortlistedCandidates.length)}%
              </p>
              <p className="text-sm text-gray-600">Average Match Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates List */}
      <div className="grid gap-4">
        {shortlistedCandidates
          .sort((a, b) => b.matchScore - a.matchScore)
          .map((candidate) => (
          <Card 
            key={candidate.id} 
            className={`border-l-4 border-l-green-500 cursor-pointer transition-all hover:shadow-md ${
              selectedCandidates.has(candidate.id) ? "bg-green-50 shadow-md" : "bg-white"
            }`}
            onClick={() => toggleCandidateSelection(candidate.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-green-100 text-green-600">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {selectedCandidates.has(candidate.id) && (
                      <div className="absolute -top-1 -right-1 bg-green-600 rounded-full p-1">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  
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
                    <p className="text-sm text-gray-600 mt-1">{candidate.experience} experience</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {candidate.matchScore}%
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Top Candidate
                  </Badge>
                  <div className="flex flex-wrap gap-1 mt-2 justify-end">
                    {candidate.matchedSkills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {candidate.matchedSkills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{candidate.matchedSkills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCandidates.size > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-blue-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">
                  {selectedCandidates.size} candidates selected for interview invitation
                </span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4 mr-2" />
                    Send Invitations
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Send Interview Invitations</DialogTitle>
                    <DialogDescription>
                      Review and send interview invitations to {selectedCandidates.size} selected candidates
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Selected Candidates:</h4>
                      <div className="space-y-1">
                        {shortlistedCandidates
                          .filter(c => selectedCandidates.has(c.id))
                          .map(candidate => (
                            <div key={candidate.id} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>{candidate.name} ({candidate.email})</span>
                            </div>
                          ))}
                      </div>
                    </div>
                    <Button onClick={sendInvitations} className="w-full bg-green-600 hover:bg-green-700">
                      <Send className="h-4 w-4 mr-2" />
                      Confirm and Send Invitations
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShortlistView;

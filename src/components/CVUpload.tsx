
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { Candidate, JobDescription } from "@/types/screening";
import { useToast } from "@/hooks/use-toast";

interface CVUploadProps {
  jobDescription: JobDescription | null;
  onCVsUploaded: (candidates: Candidate[]) => void;
}

interface FileUpload {
  file: File;
  id: string;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
}

const CVUpload = ({ jobDescription, onCVsUploaded }: CVUploadProps) => {
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Mock candidate data generator
  const generateMockCandidate = (file: File): Candidate => {
    const names = ["John Smith", "Sarah Johnson", "Michael Chen", "Emily Davis", "David Wilson", "Lisa Anderson", "James Brown", "Maria Garcia"];
    const skills = ["JavaScript", "React", "Node.js", "Python", "Java", "SQL", "AWS", "Docker", "TypeScript", "Git"];
    const experiences = ["2 years", "3 years", "5 years", "7 years", "4 years", "6 years"];
    
    const name = names[Math.floor(Math.random() * names.length)];
    const candidateSkills = skills.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 6) + 3);
    const matchedSkills = candidateSkills.filter(skill => 
      jobDescription?.requiredSkills.includes(skill)
    );
    const matchScore = Math.floor(Math.random() * 40) + 60; // 60-100% for demo

    return {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
      phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      fileName: file.name,
      fileSize: file.size,
      matchScore,
      matchedSkills,
      missingSkills: jobDescription?.requiredSkills.filter(skill => !candidateSkills.includes(skill)) || [],
      experience: experiences[Math.floor(Math.random() * experiences.length)],
      summary: `Experienced ${jobDescription?.title.toLowerCase() || 'developer'} with strong background in ${matchedSkills.slice(0, 3).join(', ')}. Demonstrated ability to deliver high-quality solutions.`,
      status: "pending",
      uploadedAt: new Date()
    };
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit.`,
          variant: "destructive"
        });
        return;
      }

      const upload: FileUpload = {
        file,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
        status: "uploading"
      };

      setUploads(prev => [...prev, upload]);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploads(prev => prev.map(u => {
          if (u.id === upload.id) {
            const newProgress = Math.min(u.progress + Math.random() * 30, 100);
            const newStatus = newProgress === 100 ? "processing" : "uploading";
            return { ...u, progress: newProgress, status: newStatus };
          }
          return u;
        }));
      }, 500);

      // Complete after 3 seconds
      setTimeout(() => {
        clearInterval(interval);
        setUploads(prev => prev.map(u => 
          u.id === upload.id ? { ...u, progress: 100, status: "complete" } : u
        ));
      }, 3000);
    });
  };

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  };

  const processUploads = async () => {
    if (!jobDescription) {
      toast({
        title: "No job description",
        description: "Please upload a job description first.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const candidates = uploads
      .filter(u => u.status === "complete")
      .map(u => generateMockCandidate(u.file));

    onCVsUploaded(candidates);
    setIsProcessing(false);
    
    toast({
      title: "CVs processed successfully",
      description: `${candidates.length} candidates matched against job requirements.`,
    });
  };

  if (!jobDescription) {
    return (
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-6">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Upload Job Description First</h3>
            <p className="text-amber-600">Please upload a job description before uploading CVs.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Candidate CVs
          </CardTitle>
          <CardDescription>
            Upload multiple CV files to match against: <strong>{jobDescription.title}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <div>
              <label htmlFor="cv-upload" className="cursor-pointer">
                <span className="text-xl font-medium text-blue-600 hover:text-blue-500">
                  Choose CV files
                </span>
                <input
                  id="cv-upload"
                  type="file"
                  multiple
                  className="sr-only"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                />
              </label>
              <p className="text-gray-500 mt-2">or drag and drop multiple files</p>
              <p className="text-sm text-gray-400 mt-1">PDF, DOC, DOCX up to 10MB each</p>
            </div>
          </div>

          {uploads.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Uploaded Files ({uploads.length})</h4>
              {uploads.map((upload) => (
                <div key={upload.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{upload.file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        upload.status === "complete" ? "default" :
                        upload.status === "error" ? "destructive" : "secondary"
                      }>
                        {upload.status === "uploading" && "Uploading"}
                        {upload.status === "processing" && "Processing"}
                        {upload.status === "complete" && "Complete"}
                        {upload.status === "error" && "Error"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUpload(upload.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {upload.status !== "complete" && (
                    <Progress value={upload.progress} className="h-2" />
                  )}
                </div>
              ))}
            </div>
          )}

          {uploads.length > 0 && uploads.every(u => u.status === "complete") && (
            <Button 
              onClick={processUploads}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isProcessing ? (
                <>Processing CVs...</>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Process {uploads.length} CVs
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {uploads.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-blue-700">
              <FileText className="h-5 w-5" />
              <span className="font-medium">
                {uploads.filter(u => u.status === "complete").length} of {uploads.length} files ready for processing
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CVUpload;

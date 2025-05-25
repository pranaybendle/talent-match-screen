
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, CheckCircle, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { JobDescription } from "@/hooks/useJobDescriptions";

interface JobDescriptionUploadProps {
  onUpload: (jobDescription: any) => void;
  existingJobs?: JobDescription[];
  selectedJob?: JobDescription | null;
  onSelectJob?: (job: JobDescription) => void;
}

const JobDescriptionUpload = ({ onUpload, existingJobs = [], selectedJob, onSelectJob }: JobDescriptionUploadProps) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    content: "",
    experience: "",
    location: ""
  });
  const [isUploaded, setIsUploaded] = useState(false);
  const [mode, setMode] = useState<"create" | "select">("create");
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFormData(prev => ({ ...prev, content }));
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been processed.`,
        });
      };
      reader.readAsText(file);
    }
  };

  const extractSkills = (content: string): string[] => {
    const commonSkills = [
      "JavaScript", "React", "Node.js", "Python", "Java", "SQL", "AWS", "Docker",
      "TypeScript", "Git", "REST APIs", "MongoDB", "PostgreSQL", "Linux", "Agile",
      "Scrum", "HTML", "CSS", "Angular", "Vue.js", "Express", "Spring Boot"
    ];
    
    return commonSkills.filter(skill => 
      content.toLowerCase().includes(skill.toLowerCase())
    );
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.company || !formData.content) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const jobDescription = {
      title: formData.title,
      company: formData.company,
      content: formData.content,
      requiredSkills: extractSkills(formData.content),
      experience: formData.experience,
      location: formData.location,
    };

    onUpload(jobDescription);
    setIsUploaded(true);
    toast({
      title: "Job Description uploaded",
      description: "Ready to upload candidate CVs.",
    });
  };

  const handleSelectExisting = (jobId: string) => {
    const job = existingJobs.find(j => j.id === jobId);
    if (job && onSelectJob) {
      onSelectJob(job);
      setIsUploaded(true);
    }
  };

  if (isUploaded || selectedJob) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                Job Description Selected: {selectedJob?.title || formData.title}
              </h3>
              <p className="text-green-600">
                Company: {selectedJob?.company || formData.company}
              </p>
              <p className="text-green-600">You can now proceed to upload candidate CVs.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {existingJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Select Mode
            </CardTitle>
            <CardDescription>
              Choose whether to create a new job description or use an existing one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant={mode === "create" ? "default" : "outline"}
                onClick={() => setMode("create")}
              >
                Create New
              </Button>
              <Button
                variant={mode === "select" ? "default" : "outline"}
                onClick={() => setMode("select")}
              >
                Use Existing ({existingJobs.length})
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {mode === "select" && existingJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Existing Job Description</CardTitle>
            <CardDescription>
              Choose from your previously created job descriptions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={handleSelectExisting}>
              <SelectTrigger>
                <SelectValue placeholder="Select a job description" />
              </SelectTrigger>
              <SelectContent>
                {existingJobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{job.title}</span>
                      <span className="text-sm text-gray-500">{job.company}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {mode === "create" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Job Description Details
              </CardTitle>
              <CardDescription>
                Enter the job details and requirements for candidate matching
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Senior Software Developer"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    placeholder="e.g., Tech Corp Inc."
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Required</Label>
                  <Input
                    id="experience"
                    placeholder="e.g., 3-5 years"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Remote / New York, NY"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Description Content</CardTitle>
              <CardDescription>
                Upload a file or paste the job description text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500 font-medium">
                      Upload a job description file
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".txt,.doc,.docx,.pdf"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="text-gray-500 mt-1">or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">TXT, DOC, DOCX, PDF up to 10MB</p>
                </div>
              </div>

              <div className="text-center text-gray-500 font-medium">OR</div>

              <div className="space-y-2">
                <Label htmlFor="content">Paste Job Description *</Label>
                <Textarea
                  id="content"
                  placeholder="Paste the complete job description here..."
                  className="min-h-[200px]"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>

              <Button 
                onClick={handleSubmit} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Process Job Description
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default JobDescriptionUpload;

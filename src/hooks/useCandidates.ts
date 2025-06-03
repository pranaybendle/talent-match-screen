
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export interface Candidate {
  id: string;
  job_description_id: string;
  name: string;
  email: string;
  phone: string | null;
  file_name: string;
  file_size: number;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  experience: string | null;
  summary: string | null;
  status: "pending" | "shortlisted" | "rejected" | "invited";
  created_at: string;
  updated_at: string;
}

export const useCandidates = (jobDescriptionId?: string) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCandidates = async () => {
    if (!jobDescriptionId || !user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching candidates for job:', jobDescriptionId);
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("job_description_id", jobDescriptionId)
        .eq("user_id", user.id)
        .order("match_score", { ascending: false });

      if (error) throw error;
      
      // Cast the data to ensure proper typing
      const typedData = (data || []).map(candidate => ({
        ...candidate,
        status: candidate.status as "pending" | "shortlisted" | "rejected" | "invited"
      }));
      
      console.log('Fetched candidates:', typedData);
      setCandidates(typedData);
    } catch (error: any) {
      console.error('Error fetching candidates:', error);
      toast({
        title: "Error fetching candidates",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCandidate = async (candidateData: Omit<Candidate, "id" | "created_at" | "updated_at">) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create candidates.",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }

    try {
      console.log('Creating candidate:', candidateData);
      const { data, error } = await supabase
        .from("candidates")
        .insert([{
          ...candidateData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      const typedData = {
        ...data,
        status: data.status as "pending" | "shortlisted" | "rejected" | "invited"
      };

      console.log('Created candidate:', typedData);
      setCandidates(prev => [...prev, typedData]);
      return typedData;
    } catch (error: any) {
      console.error('Error creating candidate:', error);
      toast({
        title: "Error creating candidate",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCandidateStatus = async (candidateId: string, status: Candidate["status"]) => {
    try {
      console.log('Updating candidate status:', candidateId, status);
      const { data, error } = await supabase
        .from("candidates")
        .update({ status })
        .eq("id", candidateId)
        .eq("user_id", user?.id)
        .select()
        .single();

      if (error) throw error;

      const typedData = {
        ...data,
        status: data.status as "pending" | "shortlisted" | "rejected" | "invited"
      };

      console.log('Updated candidate:', typedData);
      setCandidates(prev => 
        prev.map(c => c.id === candidateId ? { ...c, status } : c)
      );

      toast({
        title: "Status updated",
        description: `Candidate has been ${status}.`,
      });

      return typedData;
    } catch (error: any) {
      console.error('Error updating candidate status:', error);
      toast({
        title: "Error updating candidate status",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [jobDescriptionId, user]);

  return {
    candidates,
    loading,
    createCandidate,
    updateCandidateStatus,
    refetch: fetchCandidates,
  };
};

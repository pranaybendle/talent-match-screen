
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  content: string;
  required_skills: string[];
  experience: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export const useJobDescriptions = () => {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchJobDescriptions = async () => {
    try {
      const { data, error } = await supabase
        .from("job_descriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobDescriptions(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching job descriptions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createJobDescription = async (jobData: Omit<JobDescription, "id" | "created_at" | "updated_at">) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create job descriptions.",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }

    try {
      const { data, error } = await supabase
        .from("job_descriptions")
        .insert([{
          ...jobData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setJobDescriptions(prev => [data, ...prev]);
      toast({
        title: "Job description created",
        description: "Your job description has been saved successfully.",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error creating job description",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchJobDescriptions();
  }, []);

  return {
    jobDescriptions,
    loading,
    createJobDescription,
    refetch: fetchJobDescriptions,
  };
};

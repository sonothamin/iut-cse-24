export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          roll: string;
          section: string;
          blood_group: string;
          email: string;
          role: "admin" | "moderator" | "user";
          visible: boolean;
        };
        Insert: {
          first_name: string;
          last_name: string;
          roll?: string;
          section?: string;
          blood_group?: string;
          email: string;
          role?: "admin" | "moderator" | "user";
          visible?: boolean;
        };
        Update: Partial<{
          first_name: string;
          last_name: string;
          roll: string;
          section: string;
          blood_group: string;
          email: string;
          role: "admin" | "moderator" | "user";
          visible: boolean;
        }>;
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          event_date: string;
          end_date: string | null;
          place: string | null;
          location_details: string | null;
          image_url: string | null;
          organizer: string | null;
          organizer_id: string | null;
          resources: string[] | null;
          attachments: string[] | null;
          max_participants: number | null;
          registration_required: boolean;
          registration_deadline: string | null;
          status: "draft" | "published" | "cancelled" | "completed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description?: string | null;
          event_date: string;
          end_date?: string | null;
          place?: string | null;
          location_details?: string | null;
          image_url?: string | null;
          organizer?: string | null;
          organizer_id?: string | null;
          resources?: string[] | null;
          attachments?: string[] | null;
          max_participants?: number | null;
          registration_required?: boolean;
          registration_deadline?: string | null;
          status?: "draft" | "published" | "cancelled" | "completed";
        };
        Update: {
          title?: string;
          description?: string | null;
          event_date?: string;
          end_date?: string | null;
          place?: string | null;
          location_details?: string | null;
          image_url?: string | null;
          organizer?: string | null;
          organizer_id?: string | null;
          resources?: string[] | null;
          attachments?: string[] | null;
          max_participants?: number | null;
          registration_required?: boolean;
          registration_deadline?: string | null;
          status?: "draft" | "published" | "cancelled" | "completed";
        };
      };
      notices: {
        Row: { id: string; title: string; notice_date?: string };
        Insert: { title: string; notice_date?: string };
        Update: { title?: string; notice_date?: string };
      };
    };
  };
};

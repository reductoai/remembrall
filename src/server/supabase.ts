export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      Account: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          oauth_token: string | null
          oauth_token_secret: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          refresh_token_expires_in: number | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id: string
          id_token?: string | null
          oauth_token?: string | null
          oauth_token_secret?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          refresh_token_expires_in?: number | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId: string
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          oauth_token?: string | null
          oauth_token_secret?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          refresh_token_expires_in?: number | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Account_userId_fkey"
            columns: ["userId"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      Document: {
        Row: {
          content: string
          contextId: string
          id: string
          name: string
        }
        Insert: {
          content: string
          contextId: string
          id: string
          name: string
        }
        Update: {
          content?: string
          contextId?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "Document_contextId_fkey"
            columns: ["contextId"]
            referencedRelation: "DocumentContext"
            referencedColumns: ["id"]
          }
        ]
      }
      DocumentContext: {
        Row: {
          chunkSize: number
          context: string
          createdAt: string
          id: string
          name: string
          userId: string
        }
        Insert: {
          chunkSize: number
          context?: string
          createdAt?: string
          id?: string
          name: string
          userId: string
        }
        Update: {
          chunkSize?: number
          context?: string
          createdAt?: string
          id?: string
          name?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "DocumentContext_userId_fkey"
            columns: ["userId"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      History: {
        Row: {
          content: string
          id: string
          role: Database["public"]["Enums"]["Role"]
          storeId: string
          userId: string
        }
        Insert: {
          content: string
          id?: string
          role: Database["public"]["Enums"]["Role"]
          storeId: string
          userId: string
        }
        Update: {
          content?: string
          id?: string
          role?: Database["public"]["Enums"]["Role"]
          storeId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "History_userId_fkey"
            columns: ["userId"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      Memory: {
        Row: {
          content: string
          embedding: string
          id: string
          storeId: string
          updatedAt: string
          userId: string
        }
        Insert: {
          content: string
          embedding: string
          id?: string
          storeId: string
          updatedAt: string
          userId: string
        }
        Update: {
          content?: string
          embedding?: string
          id?: string
          storeId?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Memory_userId_fkey"
            columns: ["userId"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      Request: {
        Row: {
          createdAt: string
          duration: number
          id: string
          memoryUpdate: Json | null
          model: string
          numTokens: number
          request: Json
          response: Json
          userId: string
        }
        Insert: {
          createdAt?: string
          duration: number
          id?: string
          memoryUpdate?: Json | null
          model: string
          numTokens: number
          request: Json
          response: Json
          userId: string
        }
        Update: {
          createdAt?: string
          duration?: number
          id?: string
          memoryUpdate?: Json | null
          model?: string
          numTokens?: number
          request?: Json
          response?: Json
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Request_userId_fkey"
            columns: ["userId"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      Session: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Insert: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Session_userId_fkey"
            columns: ["userId"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      Snippet: {
        Row: {
          content: string
          createdAt: string
          documentId: string | null
          embedding: string
          id: string
          userId: string
        }
        Insert: {
          content: string
          createdAt?: string
          documentId?: string | null
          embedding: string
          id?: string
          userId: string
        }
        Update: {
          content?: string
          createdAt?: string
          documentId?: string | null
          embedding?: string
          id?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Snippet_documentId_fkey"
            columns: ["documentId"]
            referencedRelation: "Document"
            referencedColumns: ["id"]
          }
        ]
      }
      User: {
        Row: {
          apiKey: string
          createdAt: string
          email: string | null
          emailVerified: string | null
          gh_username: string | null
          id: string
          image: string | null
          memoryPrompt: string | null
          name: string | null
          stripeId: string | null
          subscription: Database["public"]["Enums"]["Subscription"] | null
          updatedAt: string
          username: string | null
        }
        Insert: {
          apiKey?: string
          createdAt?: string
          email?: string | null
          emailVerified?: string | null
          gh_username?: string | null
          id: string
          image?: string | null
          memoryPrompt?: string | null
          name?: string | null
          stripeId?: string | null
          subscription?: Database["public"]["Enums"]["Subscription"] | null
          updatedAt: string
          username?: string | null
        }
        Update: {
          apiKey?: string
          createdAt?: string
          email?: string | null
          emailVerified?: string | null
          gh_username?: string | null
          id?: string
          image?: string | null
          memoryPrompt?: string | null
          name?: string | null
          stripeId?: string | null
          subscription?: Database["public"]["Enums"]["Subscription"] | null
          updatedAt?: string
          username?: string | null
        }
        Relationships: []
      }
      VerificationToken: {
        Row: {
          expires: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          identifier?: string
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      match_memories: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
          user_id: string
          store_id: string
        }
        Returns: {
          id: string
          content: string
          similarity: number
        }[]
      }
      match_snippets: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
          context_id: string
        }
        Returns: {
          id: string
          content: string
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      Role: "assistant" | "user"
      Subscription:
        | "incomplete"
        | "incomplete_expired"
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "paused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

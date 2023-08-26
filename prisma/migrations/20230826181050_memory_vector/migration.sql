-- AlterTable
ALTER TABLE "DocumentContext" ALTER COLUMN "id" SET DEFAULT (concat('dc-', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Memory" ADD COLUMN     "embedding" vector NOT NULL,
ALTER COLUMN "id" SET DEFAULT (concat('m-', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Snippet" ALTER COLUMN "id" SET DEFAULT (concat('snp-', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "apiKey" SET DEFAULT (concat('gp-', gen_random_uuid()))::TEXT;


create or replace function match_memories (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  user_id text,
  store_id text
)
returns table (
  id text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    "Memory".id,
    "Memory".content,
    1 - ("Memory".embedding <=> query_embedding) as similarity
  from "Memory"
  where 1 - ("Memory".embedding <=> query_embedding) > match_threshold
  and "Memory"."userId" = user_id
  and "Memory"."storeId" = store_id
  order by similarity desc
  limit match_count;
$$;
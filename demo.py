import dotenv
import openai
import os

dotenv.load_dotenv()

openai.api_key = os.environ["OPENAI_API_KEY"]
openai.api_base = "http://localhost:3000/api/openai/v1"
# openai.api_base = "https://glassparrot.vercel.app/api/openai/v1"

completion = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    # {"role": "assistant", "content": "Hey friendo what can I do for ya?"},
    {"role": "user", "content": "What are the partnership benefits?"},
  ],
  headers={
    "x-gp-api-key": os.environ["GP_API_KEY"],
    "x-gp-context": "dc-4f6a820c-0d53-407d-ab4d-653347c68a26"
  },
)

print(completion)


# for chunk in completion:
#     print(chunk)


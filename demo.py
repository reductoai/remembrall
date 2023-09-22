import dotenv
import openai
import os

dotenv.load_dotenv()

openai.api_key = os.environ["OPENAI_API_KEY"]
openai.api_base = "http://localhost:3000/api/openai/v1"



completion = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What about the US? Provide the population too."},
  ],
  headers={
    "x-gp-api-key": "gp-dc0e0d2d-ff10-4345-b5fe-e427ce541fab",
    "x-gp-remember": "test1",
    "x-gp-short": "true",
  },
)

print(completion)

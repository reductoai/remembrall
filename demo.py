import dotenv
import openai
import os

dotenv.load_dotenv()

openai.api_key = os.environ["OPENAI_API_KEY"]
openai.api_base = "http://localhost:3000/api/openai/v1"
# openai.api_base = "https://glassparrot.vercel.app/api/openai/v1"
# openai.api_base = "https://remembrall.dev/api/openai/v1"

completion = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "I've been struggling with my co-founder Bob lately. He's just so annoying when he nags."},
  ],
  headers={
    "x-gp-api-key": os.environ["GP_API_KEY"],
    # "x-gp-context": "dc-4f6a820c-0d53-407d-ab4d-653347c68a26",
    "x-gp-remember": "raunak",
  },
)

print(completion)


# for chunk in completion:
#     print(chunk)


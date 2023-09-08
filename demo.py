import dotenv
import openai
import os

dotenv.load_dotenv()

openai.api_key = os.environ["OPENAI_API_KEY"]
openai.api_base = "https://remembrall.dev/api/openai/v1"

completion = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What do you know about diffusion?"},
  ],
  headers={
    "x-gp-api-key": os.environ["GP_API_KEY"],
    "x-gp-context": "dc-9c83c217-b5c6-4f94-b42f-7dd181c011e3",
    # "x-gp-remember": "raunak",
  },
)

print(completion)

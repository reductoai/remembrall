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
    {"role": "user", "content": "I'm in NYC right now. I love the Modal Hackathon. Programming is so fun to me."},
  ],
  headers={
    "x-gp-api-key": os.environ["GP_API_KEY"],
    # "x-gp-context": "dc-301612c9-a4c2-4774-bb2c-91f05d212394",
    "x-gp-remember": "raunak",
  },
)

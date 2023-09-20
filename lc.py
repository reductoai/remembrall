from langchain.chat_models import ChatOpenAI
import os
import dotenv
import time

dotenv.load_dotenv()

chat_model = ChatOpenAI(openai_api_base="https://remembrall.dev/api/openai/v1",
                        model_kwargs={
                            "headers":{
                                "x-gp-api-key": os.environ["GP_API_KEY"],
                                "x-gp-remember": "raunak",
                            }
                        })

chat_model.predict("My favorite color is blue.")
time.sleep(2)
print(chat_model.predict("What is my favorite color?"))

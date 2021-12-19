import os
import openai
import sys

openai.api_key = os.getenv("OPENAI_API_KEY")
max_tokens = 60
if '"""' in sys.argv[1][0:2]:
	max_tokens = 100
if '//' in sys.argv[1][0:1]:
	max_tokens = 255
response = openai.Completion.create(
	engine="davinci",
	prompt=sys.argv[1],
	temperature=0.3,
	max_tokens=max_tokens,
	top_p=0.3,
	frequency_penalty=0.5,
	presence_penalty=0.0,
	stop=["\n\n"]
	)
print(response)

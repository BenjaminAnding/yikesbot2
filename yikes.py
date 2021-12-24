import os
import openai
import sys

openai.api_key = os.getenv("OPENAI_API_KEY")
with open('out.txt', 'w+') as file:
	file.write(f'args: {sys.argv}')
max_tokens = int(sys.argv[2])
stop = sys.argv[3]
engine = sys.argv[4]
codex = 'codex'
if codex in engine:
	message = sys.argv[1][3:-3]
else:
	message = sys.argv[1]

response = openai.Completion.create(
	engine=engine,
	prompt=message,
	temperature=0.3,
	max_tokens=max_tokens,
	top_p=0.3,
	frequency_penalty=0.5,
	presence_penalty=0.0,
	stop=[stop]
	)
print(response)

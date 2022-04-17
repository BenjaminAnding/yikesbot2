from transformers import GPTJForCausalLM
from transformers import AutoTokenizer
import discord
import torch
import os
from discord.ext import commands
import random
# This example requires the 'members' and 'message_content' privileged intents to function.


model = GPTJForCausalLM.from_pretrained("EleutherAI/gpt-j-6B", revision="float32", torch_dtype=torch.float32, low_cpu_mem_usage=True)
tokenizer = AutoTokenizer.from_pretrained("EleutherAI/gpt-j-6B")

description = '''An example bot to showcase the discord.ext.commands extension
module. With GPTJ functionality.

There are a number of utility commands being showcased here.'''

intents = discord.Intents.default()
intents.members = True
#intents.message_content = True

bot = commands.Bot(command_prefix='?', description=description, intents=intents)


@bot.event
async def on_ready():
    print(f'Logged in as {bot.user} (ID: {bot.user.id})')
    print('------')


@bot.command()
async def chat(ctx, context: str):
	prompt = ctx.author.name + ':' + context + '\n' + 'you:'
	input_ids = tokenizer(prompt, return_tensors="pt").input_ids
	gen_tokens = model.generate(input_ids=input_ids, do_sample=True, temperature=0.9, max_length=250,)
	gen_text = tokenizer.batch_decode(gen_tokens)[0]
	await ctx.send(gen_text.replace(prompt, ''))


@bot.command()
async def roll(ctx, dice: str):
    """Rolls a dice in NdN format."""
    try:
        rolls, limit = map(int, dice.split('d'))
    except Exception:
        await ctx.send('Format has to be in NdN!')
        return

    result = ', '.join(str(random.randint(1, limit)) for r in range(rolls))
    await ctx.send(result)


@bot.command(description='For when you wanna settle the score some other way')
async def choose(ctx, *choices: str):
    """Chooses between multiple choices."""
    await ctx.send(random.choice(choices))


@bot.command()
async def repeat(ctx, times: int, content='repeating...'):
    """Repeats a message multiple times."""
    for i in range(times):
        await ctx.send(content)


@bot.command()
async def joined(ctx, member: discord.Member):
    """Says when a member joined."""
    await ctx.send(f'{member.name} joined in {member.joined_at}')


@bot.group()
async def cool(ctx):
    """Says if a user is cool.

    In reality this just checks if a subcommand is being invoked.
    """
    if ctx.invoked_subcommand is None:
        await ctx.send(f'No, {ctx.subcommand_passed} is not cool')


@cool.command(name='bot')
async def _bot(ctx):
    """Is the bot cool?"""
    await ctx.send('Yes, the bot is cool.')

bot.run(os.getenv("DISCORD_BOT_TOKEN"))


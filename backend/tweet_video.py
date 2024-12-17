from manim import *
import os

# Set output directory globally before initializing the scene
config.media_dir = "./output"  # Redirect all output files to 'output'


class TweetVideo(Scene):
    def construct(self):
        # Get dynamic tweet text from environment variable
        tweet_text = os.getenv("TWEET_TEXT", "Default Tweet Text")

        # Create and display the text
        text = Text(tweet_text, font_size=64)
        self.play(Write(text))
        self.wait(2)

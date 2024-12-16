from manim import *
import sys


class TweetVideo(Scene):
    def construct(self):
        # Get tweet text from command-line argument or use default
        tweet_text = sys.argv[1] if len(sys.argv) > 1 else "Default Tweet Text"

        # Display the text
        text = Text(tweet_text, font_size=64)
        self.play(Write(text))
        self.wait(2)

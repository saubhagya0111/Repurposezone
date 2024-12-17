from manim import *
import os


class SimpleTweetTemplate(Scene):
    def construct(self):
        # Dynamic tweet text from environment variable or default
        tweet_text = os.getenv("TWEET_TEXT", "Default Tweet Text")

        # Background Color
        background = Rectangle(width=16, height=9, color=BLUE, fill_opacity=1)
        self.add(background)

        # Tweet Text
        text = Text(tweet_text, font_size=48, color=WHITE).move_to(ORIGIN)
        self.play(Write(text))  # Animate text appearance
        self.wait(3)  # Display for 3 seconds

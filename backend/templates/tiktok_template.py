from manim import *


class TikTokTemplate(Scene):
    def construct(self):
        # Set resolution for TikTok (1080x1920)
        config.pixel_width = 1080
        config.pixel_height = 1920
        config.frame_width = 9
        config.frame_height = 16

        # Background
        self.add(Rectangle(width=9, height=16, color=BLACK, fill_opacity=1))

        # Add static text with font explicitly set
        text = Text("Hello TikTok!", font="Arial", font_size=60, color=WHITE)
        self.play(Write(text))
        self.wait(2)

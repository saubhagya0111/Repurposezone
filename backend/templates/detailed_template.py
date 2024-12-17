from manim import *
import os


class DetailedTweetTemplate(Scene):
    def construct(self):
        # Dynamic tweet content
        user_name = os.getenv("USER_NAME", "John Doe")
        user_handle = os.getenv("USER_HANDLE", "@johndoe")
        tweet_text = os.getenv("TWEET_TEXT", "Default Tweet Content")

        # Background Color
        background = Rectangle(width=16, height=9, color=BLACK, fill_opacity=1)
        self.add(background)

        # User Info (Profile Name and Handle)
        user_info = (
            VGroup(
                Text(user_name, font_size=40, color=WHITE),
                Text(user_handle, font_size=30, color=GRAY).next_to(UP * 0.5),
            )
            .arrange(DOWN, center=True)
            .to_edge(UP)
            .shift(DOWN * 0.5)
        )

        # Placeholder for Profile Picture (Circle)
        profile_pic = (
            Circle(radius=0.7, color=WHITE).to_edge(UP).shift(LEFT * 6 + DOWN * 0.5)
        )

        # Tweet Text
        tweet = Text(tweet_text, font_size=36, color=WHITE).move_to(ORIGIN)

        # Adding elements to the scene
        self.play(Create(profile_pic), Write(user_info))
        self.play(Write(tweet))
        self.wait(3)
